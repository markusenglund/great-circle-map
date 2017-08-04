import React, { Component } from "react"
import { connect } from "react-redux"
import * as d3 from "d3"
import * as topojson from "topojson"

class SvgMap extends Component {
  constructor() {
    super()
    this.state = {
      worldData: [],
      mouseDownLambda: null,
      mouseDownPhi: null,
      lambda: 0,
      phi: 0,
      airports: [],
      sectors: []
    }
    this.width = 1000
    this.height = 700
    this.projection = d3
      .geoOrthographic()
      .scale(250)
      .translate([this.width / 2, this.height / 2])
      .clipAngle(90)

    this.λ = d3.scaleLinear()
        .domain([0, this.width])
        .range([-180, 180])

    this.φ = d3.scaleLinear()
        .domain([0, this.height])
        .range([90, -90])

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }

  componentDidMount() {
    if (this.state.worldData.length === 0) {
      d3.json("/world-110m.json", (error, world) => {
        if (error) throw error
        this.setState({ worldData: topojson.feature(world, world.objects.land) })
      })
    }
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
      const phi = this.φ(event.clientY) - this.state.mouseDownPhi
      this.setState({ lambda, phi })
    }
  }

  render() {
    this.projection.rotate([this.state.lambda, this.state.phi])
    const path = d3
      .geoPath()
      .projection(this.projection)
      .pointRadius(3)

    const { airports, sectors } = this.state

    return (
      <div id="d3-map-wrapper">
        <svg
          id="svg"
          width={this.width}
          height={this.height}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
        >
          <path className="svg-land" d={path(this.state.worldData)} />
          <g>
            {airports.map(airport => (
              <path
                fill="red"
                d={path({ type: "Point", coordinates: [airport.lng, airport.lat] })}
                key={airport.id}
              />
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
        </svg>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return { routes: state.routes }
}

export default connect(mapStateToProps)(SvgMap)
