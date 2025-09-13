import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import greatCircle from '@turf/great-circle';
import { point as turfPoint } from '@turf/helpers';

import { getRoutes, getAirports, getSectors, getBrighterColor } from '../../selectors';

class LeafletMap extends Component {
  render() {
    const { routes, routeColor } = this.props;

    function turfGreatCirclePositions(a, b, npoints = 128) {
      if (!a || !b) return [];
      const from = turfPoint([a.lng, a.lat]);
      const to = turfPoint([b.lng, b.lat]);
      const feature = greatCircle(from, to, { npoints });
      const { type, coordinates } = feature.geometry;
      if (type === 'LineString') {
        return [coordinates.map(([lng, lat]) => [lat, lng])];
      }
      if (type === 'MultiLineString') {
        return coordinates.map(line => line.map(([lng, lat]) => [lat, lng]));
      }
      return [];
    }

    function repeatAcrossDateline(positions, offsets = [-360, 0, 360]) {
      return offsets.map(offset => positions.map(([lat, lng]) => [lat, lng + offset]));
    }

    return (
      <div id="map-container">
        <MapContainer
          id="map"
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {Array.isArray(routes) &&
            routes.map(route => {
              if (!Array.isArray(route) || route.length < 2) return null;
              return route.slice(0, -1).flatMap((airport, idx) => {
                const nextAirport = route[idx + 1];
                const segments = turfGreatCirclePositions(airport, nextAirport);
                const repeated = segments.flatMap(positions => repeatAcrossDateline(positions));
                return repeated.map(positions => (
                  <Polyline
                    positions={positions}
                    pathOptions={{ color: routeColor, weight: 2, noClip: true }}
                  />
                ));
              });
            })}
        </MapContainer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    routes: getRoutes(state).routes,
    sectors: getSectors(state),
    airports: getAirports(state),
    label: state.router.query.label || 'city',
    routeColor: state.router.query.color || '#d03030',
    pointColor: getBrighterColor(state)
  };
}

LeafletMap.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.array),
  sectors: PropTypes.arrayOf(PropTypes.array),
  airports: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  routeColor: PropTypes.string,
  pointColor: PropTypes.string
};

LeafletMap.defaultProps = {
  routes: null,
  sectors: null,
  airports: null,
  label: 'city',
  routeColor: '#d03030',
  pointColor: '#ffffff'
};

export default connect(mapStateToProps)(LeafletMap);
