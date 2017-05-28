import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withGoogleMap, GoogleMap, Polyline, Marker, OverlayView } from "react-google-maps"
import withScriptjs from "react-google-maps/lib/async/withScriptjs"

import { getAirportData } from "../actionCreators"

function getPixelPositionOffset(width, height) {
  return { x: 0, y: -(height / 5) }
}

const AsyncGoogleMap = withScriptjs(withGoogleMap(({ routes, onMapMounted }) => {
  let id = 0
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
          key={(id += 1)}
        />
      ))}
      {airports.map(airport => (
        <div key={(id += 1)}>
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
            <div className="overlay-view">
              <h4>{airport.iata}</h4>
            </div>
          </OverlayView>
        </div>
      ))}
    </GoogleMap>
  )
}))

class Map extends Component {
  // Room for improvement: This should start to load AFTER all the google maps stuff.
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getAirportData())
  }

  componentDidUpdate() {
    // Change the viewport to fit the airports that have been rendered to the map.
    const { routes } = this.props
    const { LatLngBounds, LatLng } = google.maps
    const newBounds = new LatLngBounds()
    routes.forEach((route) => {
      route.forEach((airport) => {
        newBounds.extend(new LatLng(Number(airport.lat), Number(airport.lng)))
      })
    })
    this.map.fitBounds(newBounds)
  }

  handleMapMounted(map) {
    this.map = map
  }

  render() {
    const { routes } = this.props
    return (
      <div className="map-wrapper">
        <AsyncGoogleMap
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBISa-Ul-NOnD-H5lweC_w4evLmV_0fuSU"
          loadingElement={
            <div style={{ height: "300px" }} />
          }
          containerElement={
            <div style={{ height: "100%" }} />
          }
          mapElement={
            <div className="map-element" />
          }
          routes={routes}
          onMapMounted={map => this.handleMapMounted(map)}
        />
      </div>
    )
  }
}
Map.propTypes = {
  dispatch: PropTypes.func.isRequired,
  routes: PropTypes.arrayOf(PropTypes.array).isRequired
}

function mapStateToProps(state) {
  return {
    routes: state.routes
  }
}

export default connect(mapStateToProps)(Map)
