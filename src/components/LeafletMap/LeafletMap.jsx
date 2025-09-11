import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getRoutes, getAirports, getSectors, getBrighterColor } from '../../selectors';

class LeafletMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foo: 'bar'
    };
  }

  render() {
    return (
      <div>
        Leaflet Map Component
        {this.state.foo}
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

export default connect(mapStateToProps)(LeafletMap);
