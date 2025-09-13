import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MapContainer, TileLayer } from 'react-leaflet';

import { getRoutes, getAirports, getSectors, getBrighterColor } from '../../selectors';

class LeafletMap extends Component {
  render() {
    return (
      <div id="map-container">
        <MapContainer
          id="map"
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={false}
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
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
