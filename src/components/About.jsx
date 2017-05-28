import React, { Component } from "react"
import * as d3 from "d3"
import * as topojson from "topojson"

class Map extends Component {
  constructor() {
    super()

    const width = 1000
    const height = 500
    const svg = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height)
      .on("wheel", () => d3.event.preventDefault())
    const g = svg.append("g")

    // Converts lat and long to points on the svg
    const projection = d3.geoEquirectangular()
      .translate([width / 2, height / 2])
      .scale(150)

    const path = d3.geoPath()
      .projection(projection)

    const zoom = d3.zoom()
      .scaleExtent([1, 10])
      .on("zoom", () => {
        g.attr("transform", d3.event.transform)
      })
    svg.call(zoom)

    function renderMap(err, mapData) {
      if (err) throw err
      console.log(mapData)
      const countries = topojson.feature(mapData, mapData.objects.ne_50m_admin_0_countries_lakes
).features

      g.selectAll("path")
        .data(countries)
        .enter()
        .append("path")
          .attr("d", path)
    }

    d3.json("/map.json", renderMap)
  }

  render() {
    return (
      <div>
        <h1>About</h1>
      </div>
    )
  }
}

export default Map
