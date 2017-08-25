import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { geoOrthographic, geoPath, geoDistance, geoGraticule } from "d3-geo"
import { scaleLinear } from "d3-scale"
import { DraggableCore } from "react-draggable"
import { getAirports, getSectors, getGlobePosition } from "../../selectors"
import getPixelPositions from "./utils/getPixelPositions"

class SvgMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // mouseDownLambda: null,
      // mouseDownPhi: null,
      lambda: props.initialGlobePosition.lambda,
      phi: props.initialGlobePosition.phi
    }

    this.diameter = 600
    this.projection = geoOrthographic()
      .scale(this.diameter / 2)
      .translate([this.diameter / 2, this.diameter / 2])
      .clipAngle(90)

    this.lambdaScale = scaleLinear()
        .domain([0, this.diameter])
        .range([-90, 90])

    this.phiScale = scaleLinear()
        .domain([0, this.diameter])
        .range([90, -90])

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }

  componentWillReceiveProps({ sectors, initialGlobePosition, routeColor }) {
    if (sectors.length && routeColor === this.props.routeColor) {
      const { lambda, phi } = initialGlobePosition
      this.setState({ lambda, phi })
    }
  }

  handleMouseDown(event) {
    event.preventDefault()
    const { dispatch } = this.props
    const x = event.clientX ? event.clientX : event.touches[0].clientX
    const y = event.clientY ? event.clientY : event.touches[0].clientY
    const mouseDownLambda = this.lambdaScale(x) - this.state.lambda
    const mouseDownPhi = this.phiScale(y) - this.state.phi

    // this.setState({ mouseDownLambda, mouseDownPhi })
    dispatch({ type: "MOUSE_DOWN", mouseDownLambda, mouseDownPhi })
  }

  handleMouseMove(event) {
    const { dispatch, mouseDownLambda, mouseDownPhi } = this.props
    if (mouseDownLambda) {
      const x = event.clientX ? event.clientX : event.touches[0].clientX
      const y = event.clientY ? event.clientY : event.touches[0].clientY
      const lambda = this.lambdaScale(x) - mouseDownLambda

      if ((this.phiScale(y) - mouseDownPhi) < -65) {
        // this.setState({ mouseDownPhi: this.phiScale(event.clientY) + 65 })
        dispatch({ type: "CHANGE_REFERENCE_PHI", mouseDownPhi: this.phiScale(y) + 65 })
      } else if ((this.phiScale(y) - mouseDownPhi) > 65) {
        dispatch({ type: "CHANGE_REFERENCE_PHI", mouseDownPhi: this.phiScale(y) - 65 })
        // this.setState({ mouseDownPhi: this.phiScale(event.clientY) - 65 })
      }
      let phi = this.phiScale(y) - mouseDownPhi

      if (phi < -65) {
        phi = -65
      } else if (phi > 65) {
        phi = 65
      }
      this.setState({ lambda, phi })
      dispatch({ type: "MOUSE_MOVE" })
    }
  }

  render() {
    const { lambda, phi } = this.state
    this.projection.rotate([lambda, phi])
    const path = geoPath()
      .projection(this.projection)
      .pointRadius(3)

    const { mapData, label, airports, sectors, routeColor } = this.props
    const pixelPositions = getPixelPositions(airports, this.projection, lambda, phi)

    return (
      <div id="svg-wrapper">
        <DraggableCore onStart={this.handleMouseDown} onDrag={this.handleMouseMove}>
          <svg id="svg" viewBox={`-25 -25 ${this.diameter + 50} ${this.diameter + 50}`}>
            <defs>
              <radialGradient id="ocean-gradient" cx="65%" cy="20%">
                <stop offset="0%" stopColor="#799" />
                <stop offset="100%" stopColor="#368" />
              </radialGradient>
            </defs>
            <defs>
              <radialGradient id="land-gradient" cx="65%" cy="20%">
                <stop offset="0%" stopColor="#765" />
                <stop offset="100%" stopColor="#543" />
              </radialGradient>
            </defs>
            <circle
              r={this.diameter / 2}
              cx={this.diameter / 2}
              cy={this.diameter / 2}
              fill="url(#ocean-gradient)"
            />
            <path className="svg-land" d={path(mapData)} fill="url(#land-gradient)" />
            <path id="graticule" d={path(geoGraticule()())} />
            <g>
              {airports.map((airport, i) => (
                <g key={airport.id}>
                  <path
                    fill={routeColor}
                    d={path({ type: "Point", coordinates: [airport.lng, airport.lat] })}
                  />
                  {label !== "none" && geoDistance(
                    [airport.lng, airport.lat],
                    [-this.state.lambda, -this.state.phi]
                  ) < (Math.PI / 2) ?
                    <text
                      x={pixelPositions[i].x}
                      y={pixelPositions[i].y}
                      textAnchor={pixelPositions[i].textAnchor}
                      className="svg-label"
                    >
                      {airport[label] || airport.iata || airport.icao}
                    </text>
                    : null
                  }
                </g>
              ))}
            </g>
            <g>
              {sectors.map(sector => (
                <path
                  stroke={routeColor}
                  fill="none"
                  d={path({
                    type: "LineString",
                    coordinates: [[sector[0].lng, sector[0].lat], [sector[1].lng, sector[1].lat]]
                  })}
                  key={`${sector[0].id}-${sector[1].id}`}
                />
              ))}
            </g>
          </svg>
        </DraggableCore>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    routes: state.routes,
    sectors: getSectors(state),
    airports: getAirports(state),
    initialGlobePosition: getGlobePosition(state),
    mapData: state.svgMap,
    label: state.settings.label.value,
    routeColor: state.settings.routeColor,
    mouseDownLambda: state.globePosition.mouseDownLambda,
    mouseDownPhi: state.globePosition.mouseDownPhi
  }
}

SvgMap.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mapData: PropTypes.shape({ geometry: PropTypes.object }).isRequired,
  label: PropTypes.string.isRequired,
  sectors: PropTypes.arrayOf(PropTypes.array).isRequired,
  airports: PropTypes.arrayOf(PropTypes.object).isRequired,
  routeColor: PropTypes.string.isRequired,
  initialGlobePosition: PropTypes.shape({
    lambda: PropTypes.number,
    phi: PropTypes.number
  }).isRequired,
  mouseDownLambda: PropTypes.number.isRequired,
  mouseDownPhi: PropTypes.number.isRequired
}

export default connect(mapStateToProps)(SvgMap)
