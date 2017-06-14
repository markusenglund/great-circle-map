import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withGoogleMap, GoogleMap, Polyline, Marker, OverlayView } from "react-google-maps"
import withScriptjs from "react-google-maps/lib/async/withScriptjs"
import uniqueId from "lodash.uniqueid"

import { getAirportData, completeMapLoad } from "../actionCreators"

function getPixelPositionOffset(width, height) {
  return { x: 0, y: -(height / 5) }
}

const AsyncGoogleMap = withScriptjs(withGoogleMap(({ routes, onMapMounted }) => {
  // Extract all airports that are currently being rendered and filter airports already rendered
  const airports = routes.reduce((acc, val) => {
    return acc.concat(val.filter((airport) => {
      return acc.every(prevAirport => prevAirport.iata !== airport.iata)
    }))
  }, [])

  return (
    <GoogleMap
      ref={onMapMounted}
      defaultZoom={2}
      defaultCenter={{ lat: 20, lng: 0 }}
      mapTypeId="satellite"
    >
      {routes.map(route => (
        <Polyline
          path={route.map((airport) => {
            return { lat: Number(airport.lat), lng: Number(airport.lng) }
          })}
          options={{
            geodesic: true,
            strokeColor: "#B03030",
            strokeWeight: 2
          }}
          key={uniqueId()}
        />
      ))}
      {airports.map(airport => (
        <div key={uniqueId()}>
          <Marker
            position={{ lat: Number(airport.lat), lng: Number(airport.lng) }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 2,
              strokeColor: "#D03030",
              strokeWeight: 3
            }}
          />
          <OverlayView
            position={{ lat: Number(airport.lat), lng: Number(airport.lng) }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={getPixelPositionOffset}
          >
            <div className="map-label">
              <h4>{airport.userEnteredCode}</h4>
            </div>
          </OverlayView>
        </div>
      ))}
    </GoogleMap>
  )
}))

class Map extends Component {
  componentDidUpdate() {
    // Change the viewport to fit the airports that have been rendered to the map.
    const { routes } = this.props
    if (routes.length) {
      const { LatLngBounds, LatLng } = google.maps
      const newBounds = new LatLngBounds()
      routes.forEach((route) => {
        route.forEach((airport) => {
          newBounds.extend(new LatLng(Number(airport.lat), Number(airport.lng)))
        })
      })
      console.log("bounding function: ", newBounds)
      this.map.fitBounds(newBounds)
    }
  }

  handleMapMounted(map) {
    this.map = map

    // Get airportdata if we don't alraedy have it
    const { dispatch, urlParam } = this.props
    const { isMapLoaded } = this.props
    if (!isMapLoaded) {
      dispatch(completeMapLoad())
      dispatch(getAirportData(urlParam))
    }
  }

  render() {
    const { routes } = this.props
    return (
      <AsyncGoogleMap
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
      />
    )
  }
}
Map.propTypes = {
  dispatch: PropTypes.func.isRequired,
  routes: PropTypes.arrayOf(PropTypes.array).isRequired,
  urlParam: PropTypes.string,
  isMapLoaded: PropTypes.bool.isRequired
}
Map.defaultProps = { urlParam: null }

function mapStateToProps(state) {
  return {
    routes: state.routes,
    isMapLoaded: state.map.isLoaded
  }
}

export default connect(mapStateToProps)(Map)
