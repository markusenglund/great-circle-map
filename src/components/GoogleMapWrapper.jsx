import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import { getAirportData } from "../actionCreators"
import GoogleMap from "./GoogleMap"

class GoogleMapWrapper extends Component {
  componentDidUpdate() {
    // Change the viewport to fit the airports that have been rendered to the map.
    const { routes, shouldMapRebound, map } = this.props
    if (routes.length && shouldMapRebound && map) {
      const { LatLngBounds, LatLng } = google.maps
      const newBounds = new LatLngBounds()
      routes.forEach((route) => {
        route.forEach((airport) => {
          newBounds.extend(new LatLng(airport.lat, airport.lng))
        })
      })
      map.fitBounds(newBounds)
    }
  }

  handleMapMounted(map) {
    const { dispatch, isMapLoaded } = this.props
    if (map && !isMapLoaded) {
      dispatch({ type: "COMPLETE_MAP_LOAD", map })
      // dispatch(getAirportData())
    }
  }

  render() {
    const { routes, mapType, label, zoom, isMapLoaded } = this.props
    return (
      <GoogleMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBISa-Ul-NOnD-H5lweC_w4evLmV_0fuSU"
        loadingElement={
          <div style={{ height: "100%" }} />
        }
        containerElement={
          <div id="map-container" />
        }
        mapElement={
          <div id="map" />
        }
        routes={routes}
        onMapMounted={map => this.handleMapMounted(map)}
        mapType={mapType}
        label={label}
        zoom={zoom}
        isMapLoaded={isMapLoaded}
      />
    )
  }
}
GoogleMapWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  routes: PropTypes.arrayOf(PropTypes.array).isRequired,
  isMapLoaded: PropTypes.bool.isRequired,
  map: PropTypes.shape({ fitBounds: PropTypes.func }),
  shouldMapRebound: PropTypes.bool.isRequired,
  mapType: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  zoom: PropTypes.number.isRequired
}
GoogleMapWrapper.defaultProps = { map: null }

function mapStateToProps(state) {
  return {
    routes: state.routes,
    isMapLoaded: state.map.isLoaded,
    mapType: state.settings.mapType.type,
    label: state.settings.label.value,
    shouldMapRebound: state.map.shouldMapRebound,
    map: state.map.map,
    zoom: state.map.zoom
  }
}

export default connect(mapStateToProps)(GoogleMapWrapper)
