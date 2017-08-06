import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { geoOrthographic, geoPath, geoDistance, geoGraticule, geoBounds } from "d3-geo"
import { scaleLinear } from "d3-scale"

function calculateLambdaPhi(airports) {
  let lambda = 0
  let phi = 0
  if (airports.length) {
    const airportCoords = airports.map((airport) => {
      return [airport.lng, airport.lat]
    })
    const multiPoint = {
      type: "MultiPoint",
      coordinates: airportCoords
    }
    const boundingBox = geoBounds(multiPoint)

    if (boundingBox[0][0] <= boundingBox[1][0]) {
      lambda = -(boundingBox[0][0] + boundingBox[1][0]) / 2
    } else {
      lambda = (-(boundingBox[0][0] + boundingBox[1][0] + 360) / 2)
    }

    if (phi < -65) {
      phi = -65
    } else if (phi > 65) {
      phi = 65
    } else {
      phi = -(boundingBox[0][1] + boundingBox[1][1]) / 2
    }
  }
  return { lambda, phi }
}

class SvgMap extends Component {
  constructor(props) {
    super(props)
    const { lambda, phi } = calculateLambdaPhi(props.airports)
    this.state = {
      mouseDownLambda: null,
      mouseDownPhi: null,
      lambda,
      phi
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
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }

  componentWillReceiveProps({ airports }) {
    if (airports.length) {
      const { lambda, phi } = calculateLambdaPhi(airports)
      this.setState({ lambda, phi })
    }
  }

  handleMouseDown(event) {
    event.preventDefault()
    const x = event.clientX
    const y = event.clientY
    this.setState({
      mouseDownLambda: this.lambdaScale(x) - this.state.lambda,
      mouseDownPhi: this.phiScale(y) - this.state.phi
    })
  }

  handleMouseUp() {
    this.setState({ mouseDownLambda: null, mouseDownPhi: null })
  }

  handleMouseMove(event) {
    if (this.state.mouseDownLambda) {
      const lambda = this.lambdaScale(event.clientX) - this.state.mouseDownLambda

      if ((this.phiScale(event.clientY) - this.state.mouseDownPhi) < -65) {
        this.setState({ mouseDownPhi: this.phiScale(event.clientY) + 65 })
      } else if ((this.phiScale(event.clientY) - this.state.mouseDownPhi) > 65) {
        this.setState({ mouseDownPhi: this.phiScale(event.clientY) - 65 })
      }
      let phi = this.phiScale(event.clientY) - this.state.mouseDownPhi

      if (phi < -65) {
        phi = -65
      } else if (phi > 65) {
        phi = 65
      }
      this.setState({ lambda, phi })
    }
  }

  render() {
    this.projection.rotate([this.state.lambda, this.state.phi])
    const path = geoPath()
      .projection(this.projection)
      .pointRadius(3)

    const { mapData, label, airports, sectors } = this.props

    return (
      <div id="svg-wrapper">
        <svg
          id="svg"
          viewBox={`-25 -25 ${this.diameter + 50} ${this.diameter + 50}`}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
        >
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
          <g>
            {airports.map(airport => (
              <g>
                <path
                  fill="red"
                  d={path({ type: "Point", coordinates: [airport.lng, airport.lat] })}
                  key={airport.id}
                />
                {label !== "none" && geoDistance(
                  [airport.lng, airport.lat],
                  [-this.state.lambda, -this.state.phi]
                ) < (Math.PI / 2) ?
                  <text
                    x={this.projection([airport.lng, airport.lat])[0] + 2}
                    y={this.projection([airport.lng, airport.lat])[1] + 15}
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
                stroke="red"
                fill="none"
                d={path({
                  type: "LineString",
                  coordinates: [[sector[0].lng, sector[0].lat], [sector[1].lng, sector[1].lat]]
                })}
                key={`${sector[0].id}-${sector[1].id}`}
              />
            ))}
          </g>
          <path id="graticule" d={path(geoGraticule()())} />
        </svg>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    routes: state.routeData.routes,
    sectors: state.routeData.sectors,
    airports: state.routeData.airports,
    mapData: state.svgMap,
    label: state.settings.label.value

  }
}

SvgMap.propTypes = {
  mapData: PropTypes.shape({ geometry: PropTypes.object }).isRequired,
  label: PropTypes.string.isRequired,
  sectors: PropTypes.arrayOf(PropTypes.array).isRequired,
  airports: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default connect(mapStateToProps)(SvgMap)
