import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { geoOrthographic, geoPath, geoDistance, geoGraticule } from 'd3-geo';
import { DraggableCore } from 'react-draggable';
import {
  getRoutes,
  getAirports,
  getSectors,
  getGlobePosition,
  getBrighterColor
} from '../../selectors';
import getPixelPositions from './getPixelPositions';
import './svg-map.scss';

class SvgMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startX: null,
      startY: null,
      startLat: null,
      startLng: null,
      centerLng: props.initialGlobePosition.centerLng,
      centerLat: props.initialGlobePosition.centerLat
    };

    this.diameter = 600;
    this.projection = geoOrthographic()
      .scale(this.diameter / 2)
      .translate([this.diameter / 2, this.diameter / 2])
      .clipAngle(90);

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  componentWillReceiveProps({ sectors, initialGlobePosition, routeColor }) {
    if (sectors.length && routeColor === this.props.routeColor) {
      const { centerLng, centerLat } = initialGlobePosition;
      this.setState({ centerLng, centerLat });
    }
  }

  handleDragStart(event) {
    const startX = event.clientX ? event.clientX : event.touches[0].clientX;
    const startY = event.clientY ? event.clientY : event.touches[0].clientY;
    const startLat = this.state.centerLat;
    const startLng = this.state.centerLng;
    this.setState({ startX, startY, startLat, startLng });
  }

  handleDrag(event) {
    const { startX, startY, startLat, startLng } = this.state;
    if (startX) {
      const x = event.clientX ? event.clientX : event.touches[0].clientX;
      const y = event.clientY ? event.clientY : event.touches[0].clientY;

      // Values are scaled
      const dx = (x - startX) / 3;
      const dy = (y - startY) / 3;

      const centerLng = startLng - dx;
      let centerLat = startLat + dy;
      if (centerLat < -65) {
        this.setState({ startLat: -dy - 65 });
        centerLat = -65;
      } else if (centerLat > 65) {
        this.setState({ startLat: -dy + 65 });
        centerLat = 65;
      }
      this.setState({ centerLng, centerLat });
    }
  }

  render() {
    const { centerLng, centerLat } = this.state;
    this.projection.rotate([-centerLng, -centerLat]);
    const path = geoPath()
      .projection(this.projection)
      .pointRadius(4);

    const { mapData, label, airports, sectors, routeColor, pointColor } = this.props;
    const pixelPositions = getPixelPositions(airports, this.projection, centerLng, centerLat);

    return (
      <div id="svg-wrapper">
        <DraggableCore onStart={this.handleDragStart} onDrag={this.handleDrag}>
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
            <path d={path(mapData)} fill="url(#land-gradient)" />
            <path id="graticule" d={path(geoGraticule()())} />
            <g>
              {sectors.map(sector => (
                <path
                  stroke={routeColor}
                  strokeWidth={2}
                  fill="none"
                  d={path({
                    type: 'LineString',
                    coordinates: [[sector[0].lng, sector[0].lat], [sector[1].lng, sector[1].lat]]
                  })}
                  key={`${sector[0].id}-${sector[1].id}`}
                />
              ))}
            </g>
            <g>
              {airports.map((airport, i) => (
                <g key={airport.id}>
                  <path
                    fill={pointColor}
                    d={path({
                      type: 'Point',
                      coordinates: [airport.lng, airport.lat]
                    })}
                  />
                  {label !== 'none' &&
                  geoDistance(
                    [airport.lng, airport.lat],
                    [this.state.centerLng, this.state.centerLat]
                  ) <
                    Math.PI / 2 ? (
                    <text
                      x={pixelPositions[i].x}
                      y={pixelPositions[i].y}
                      textAnchor={pixelPositions[i].textAnchor}
                      className="svg-label"
                    >
                      {airport[label] || airport.iata || airport.icao}
                    </text>
                  ) : null}
                </g>
              ))}
            </g>
          </svg>
        </DraggableCore>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    routes: getRoutes(state).routes,
    sectors: getSectors(state),
    airports: getAirports(state),
    initialGlobePosition: getGlobePosition(state),
    mapData: state.svgMap,
    label: state.router.query.label || 'city',
    routeColor: state.router.query.color || '#d03030',
    pointColor: getBrighterColor(state)
  };
}

SvgMap.propTypes = {
  mapData: PropTypes.shape({ geometry: PropTypes.object }).isRequired,
  label: PropTypes.string.isRequired,
  sectors: PropTypes.arrayOf(PropTypes.array).isRequired,
  airports: PropTypes.arrayOf(PropTypes.object).isRequired,
  routeColor: PropTypes.string.isRequired,
  pointColor: PropTypes.string.isRequired,
  initialGlobePosition: PropTypes.shape({
    centerLng: PropTypes.number,
    centerLat: PropTypes.number
  }).isRequired
};

export default connect(mapStateToProps)(SvgMap);
