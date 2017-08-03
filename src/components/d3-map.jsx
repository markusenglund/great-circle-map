import React, { Component } from "react"
import * as d3 from "d3"
import * as topojson from "topojson"

class Map extends Component {
  componentDidMount() {
//
//     const width = 1000
//     const height = 500
//     const svg = d3.select("#d3-map-wrapper").append("svg")
//       .attr("width", width)
//       .attr("height", height)
//       .on("wheel", () => d3.event.preventDefault())
//     const g = svg.append("g")
//
//     // Converts lat and long to points on the svg
//     const projection = d3.geoOrthographic()
//       .translate([width / 2, height / 2])
//       .scale(150)
//
//     const path = d3.geoPath()
//       .projection(projection)
//
//     const zoom = d3.zoom()
//       .scaleExtent([1, 10])
//       .on("zoom", () => {
//         g.attr("transform", d3.event.transform)
//       })
//     svg.call(zoom)
//
//     function renderMap(err, mapData) {
//       if (err) throw err
//       console.log(mapData)
//       const countries = topojson.feature(mapData, mapData.objects.ne_50m_admin_0_countries_lakes
// ).features
//
//       g.selectAll("path")
//         .data(countries)
//         .enter()
//         .append("path")
//           .attr("d", path)
//     }
//
//     d3.json("/map.json", renderMap)
    const width = 1000
    const height = 700
    var projection = d3.geoOrthographic()
        .scale(250)
        .translate([width / 2, height / 2])
        .clipAngle(90);

    console.log("projection: ", projection)
    var path = d3.geoPath()
        .projection(projection);

    console.log("path: ", path)
    var λ = d3.scaleLinear()
        .domain([0, width])
        .range([-180, 180]);

    var φ = d3.scaleLinear()
        .domain([0, height])
        .range([90, -90]);

    // var svg = d3.select("#d3-map-wrapper").append("svg")
    //     .attr("width", width)
    //     .attr("height", height);
    let svg = d3.select("#svg")

    svg.on("mousemove", function() {
      var p = d3.mouse(this);
      projection.rotate([λ(p[0]), φ(p[1])]);
      svg.selectAll("path").attr("d", path);
    });

    d3.json("/world-110m.json", function(error, world) {
      if (error) throw error;

      svg.append("path")
          .datum(topojson.feature(world, world.objects.land))
          .attr("class", "land")
          .attr("d", path);
    });
  }

  render() {
    const width = 1000
    const height = 700
    return (
      <div id="d3-map-wrapper">
        <svg id="svg" width={width} height={height}>

        </svg>
      </div>
    )
  }
}

export default Map
