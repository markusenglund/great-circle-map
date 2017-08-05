import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { geoOrthographic, geoPath, geoDistance, geoGraticule } from "d3-geo"
import { scaleLinear } from "d3-scale"

class SvgMap extends Component {
  constructor() {
    super()
    this.state = {
      mouseDownLambda: null,
      mouseDownPhi: null,
      lambda: 0,
      phi: 0,
      airports: [],
      sectors: []
    }
    this.diameter = 600
    this.projection = geoOrthographic()
      .scale(this.diameter / 2)
      .translate([this.diameter / 2, this.diameter / 2])
      .clipAngle(90)

    this.λ = scaleLinear()
        .domain([0, this.diameter])
        .range([-90, 90])

    this.φ = scaleLinear()
        .domain([0, this.diameter])
        .range([90, -90])

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }

  componentWillReceiveProps({ routes }) {
    const airports = []
    const sectors = []
    routes.forEach((route) => {
      route.forEach((airport) => {
        if (airports.every(prevAirport => prevAirport.id !== airport.id)) {
          airports.push(airport)
        }
      })
      for (let i = 1; i < route.length; i += 1) {
        sectors.push([route[i - 1], route[i]])
      }
    })
    this.setState({ airports, sectors })
  }

  handleMouseDown(event) {
    event.preventDefault()
    const x = event.clientX
    const y = event.clientY
    this.setState({
      mouseDownLambda: this.λ(x) - this.state.lambda,
      mouseDownPhi: this.φ(y) - this.state.phi
    })
  }

  handleMouseUp() {
    this.setState({ mouseDownLambda: null, mouseDownPhi: null })
  }

  handleMouseMove(event) {
    if (this.state.mouseDownLambda) {
      const lambda = this.λ(event.clientX) - this.state.mouseDownLambda
      let phi = this.φ(event.clientY) - this.state.mouseDownPhi
      if (phi < -60) {
        phi = -60
      } else if (phi > 60) {
        phi = 60
      }
      this.setState({ lambda, phi })
    }
  }

  render() {
    this.projection.rotate([this.state.lambda, this.state.phi])
    const path = geoPath()
      .projection(this.projection)
      .pointRadius(3)

    const { airports, sectors } = this.state
    const { mapData, label } = this.props
    console.log("graticule ", geoGraticule())

    return (
      <div id="svg-wrapper">
        <svg
          id="svg"
          viewBox={`-10 -10 ${this.diameter + 20} ${this.diameter + 20}`}
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
            <radialGradient id="land-gradient" cx="62%" cy="23%">
              <stop offset="0%" stopColor="#765" />
              <stop offset="100%" stopColor="#543" />
            </radialGradient>
          </defs>

          <circle
            r={this.diameter / 2}
            cx={this.diameter / 2}
            cy={this.diameter / 2}
            // fill="#05153a"
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
                {geoDistance(
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
    routes: state.routes,
    mapData: state.svgMap,
    label: state.settings.label.value

  }
}

SvgMap.propTypes = {
  mapData: PropTypes.shape({ geometry: PropTypes.object }).isRequired,
  label: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(SvgMap)
