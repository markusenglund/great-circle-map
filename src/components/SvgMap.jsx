import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { geoOrthographic, geoPath, geoDistance, geoGraticule, geoBounds } from "d3-geo"
import { scaleLinear } from "d3-scale"

function calculateLambdaPhi(sectors) {
  let lambda = 0
  let phi = 0
  if (sectors.length) {
    const lineStringCoords = sectors.map((sector) => {
      return [[sector[0].lng, sector[0].lat], [sector[1].lng, sector[1].lat]]
    })
    const multiLineString = { type: "MultiLineString", coordinates: lineStringCoords }
    const boundingBox = geoBounds(multiLineString)

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

function getPixelPositions(airports, projection, lambda, phi) {
  return airports.map((curAirport) => {
    const curPosition = projection([curAirport.lng, curAirport.lat])

    const vectorProjections = airports
      .filter(airport => airport.id !== curAirport.id)
      .filter(airport => geoDistance([airport.lng, airport.lat], [-lambda, -phi]) < (Math.PI / 2))
      .map((airport) => {
        const otherPosition = projection([airport.lng, airport.lat])

        const dx = curPosition[0] - otherPosition[0]
        const dy = otherPosition[1] - curPosition[1] // Reverse y to make it like real math

        // times twenty makes it equivalent to kilometers so the math is the same as gmaps-function
        const distance = Math.hypot(dx, dy) * 20
        const vectorLength = 10000 / (1000 + (4 * distance) + ((distance ** 2.5) / 800))
        const vectorDirection = Math.atan2(dy, dx)

        const northEastProj = vectorLength * (Math.cos(vectorDirection - (Math.PI / 4)) ** 3)
        const northWestProj = vectorLength * (Math.cos(vectorDirection - ((3 * Math.PI) / 4)) ** 3)

        return { northEastProj, northWestProj }
      })

    if (vectorProjections.length === 0) {
      return { x: curPosition[0], y: curPosition[1] + 14, textAnchor: "start" }
    }

    const directionalForces = vectorProjections.reduce((acc, val) => {
      let northEast
      let southWest
      let northWest
      let southEast
      if (val.northEastProj > 0) {
        northEast = acc.northEast + val.northEastProj
        southWest = acc.southWest - (6 * val.northEastProj)
      } else {
        northEast = acc.northEast + (6 * val.northEastProj)
        southWest = acc.southWest - val.northEastProj
      }

      if (val.northWestProj > 0) {
        northWest = acc.northWest + val.northWestProj
        southEast = acc.southEast - (6 * val.northWestProj)
      } else {
        northWest = acc.northWest + (6 * val.northWestProj)
        southEast = acc.southEast - val.northWestProj
      }
      return { northEast, southWest, northWest, southEast }
    }, { northEast: 0, southWest: 0, northWest: 0, southEast: 0 })

    const direction = Object.keys(directionalForces).reduce((a, b) => {
      return directionalForces[a] > directionalForces[b] ? a : b
    })

    const x = curPosition[0]
    let y = curPosition[1]
    let textAnchor

    switch (direction) {
      case "northEast": {
        y -= 5
        textAnchor = "start"
        break
      }
      case "northWest": {
        y -= 5
        textAnchor = "end"
        break
      }
      case "southWest": {
        y += 14
        textAnchor = "end"
        break
      }
      default: {
        y += 14
        textAnchor = "start"
        break
      }
    }
    return { x, y, textAnchor }
  })
}

class SvgMap extends Component {
  constructor(props) {
    super(props)
    const { lambda, phi } = calculateLambdaPhi(props.sectors)

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
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
  }

  componentWillReceiveProps({ sectors, routeColor }) {
    if (sectors.length && routeColor === this.props.routeColor) {
      const { lambda, phi } = calculateLambdaPhi(sectors)
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

  handleTouchStart(event) {
    const x = event.touches[0].clientX
    const y = event.touches[0].clientY
    this.setState({
      mouseDownLambda: this.lambdaScale(x) - this.state.lambda,
      mouseDownPhi: this.phiScale(y) - this.state.phi
    })
  }

  handleTouchMove(event) {
    this.handleMouseMove(event.touches[0])
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
        <svg
          id="svg"
          viewBox={`-25 -25 ${this.diameter + 50} ${this.diameter + 50}`}
          onTouchStart={this.handleTouchStart}
          onMouseDown={this.handleMouseDown}
          onTouchEnd={this.handleMouseUp}
          onMouseUp={this.handleMouseUp}
          onTouchMove={this.handleTouchMove}
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
          <path id="graticule" d={path(geoGraticule()())} />
          <g>
            {airports.map((airport, i) => (
              <g>
                <path
                  fill={routeColor}
                  d={path({ type: "Point", coordinates: [airport.lng, airport.lat] })}
                  key={airport.id}
                />
                {label !== "none" && geoDistance(
                  [airport.lng, airport.lat],
                  [-this.state.lambda, -this.state.phi]
                ) < (Math.PI / 2) ?
                  <text
                    x={pixelPositions[i].x}
                    y={pixelPositions[i].y}
                    textAnchor={pixelPositions[i].textAnchor}
                    // x={this.projection([airport.lng, airport.lat])[0] + 2}
                    // y={this.projection([airport.lng, airport.lat])[1] + 15}
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
    label: state.settings.label.value,
    routeColor: state.settings.routeColor

  }
}

SvgMap.propTypes = {
  mapData: PropTypes.shape({ geometry: PropTypes.object }).isRequired,
  label: PropTypes.string.isRequired,
  sectors: PropTypes.arrayOf(PropTypes.array).isRequired,
  airports: PropTypes.arrayOf(PropTypes.object).isRequired,
  routeColor: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(SvgMap)
