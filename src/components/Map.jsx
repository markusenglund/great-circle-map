import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withGoogleMap, GoogleMap, Polyline, Marker, OverlayView } from "react-google-maps"
import withScriptjs from "react-google-maps/lib/async/withScriptjs"
import uniqueId from "lodash.uniqueid"
import { LatLonSpherical } from "geodesy"

import { getAirportData, completeMapLoad } from "../actionCreators"

// TODO: Add a condition for like within 2000 km or something
function getPixelPositionOffset(currentAirport, airports) {
  const airportLocation = new LatLonSpherical(
    currentAirport.lat, currentAirport.lng
  )

  // FIXME: Could this be done in a more efficient way like Math.min?
  // TODO: Filter airports that are within 2000 km
  // const airportsClone = JSON.parse(JSON.stringify(airports))
  const airportsClone = airports
    .filter((airport) => {
      const location = new LatLonSpherical(airport.lat, airport.lng)
      const distance = airportLocation.distanceTo(location)
      return distance < 1500000 // 1500 km
    })
    .sort((a, b) => {
      const locationA = new LatLonSpherical(a.lat, a.lng)
      const locationB = new LatLonSpherical(b.lat, b.lng)
      const distanceA = airportLocation.distanceTo(locationA)
      const distanceB = airportLocation.distanceTo(locationB)
      return distanceA - distanceB
    })

  const directionsTaken = []
  for (let i = 1; i < Math.min(airportsClone.length, 4); i += 1) {
    const direction = [
      airportsClone[i].lat - currentAirport.lat > 0,
      airportsClone[i].lng - currentAirport.lng > 0
    ]
    directionsTaken.push(direction)
  }

  // If no nearby airports, render label to the southeast of the circle
  if (directionsTaken.length < 1) {
    return (width, height) => {
      return {
        y: -(height / 5),
        x: 0
      }
    }
  }

  // If there is no nearby airport in the opposite direction of the closest neighbor:
  // Choose that direction for the label
  if (!directionsTaken.find(dir =>
    dir[0] !== directionsTaken[0][0] && dir[1] !== directionsTaken[0][1]
  )) {
    return (width, height) => {
      return {
        y: directionsTaken[0][0] ? -(height / 5) : (-3 * height) / 4,
        x: directionsTaken[0][1] ? -width : 0
      }
    }
  }
  if (!directionsTaken.find(dir => !dir[0] && dir[1])) { // South east
    return (width, height) => {
      return {
        y: -(height / 5),
        x: 0
      }
    }
  }
  if (!directionsTaken.find(dir => !dir[0] && !dir[1])) { // South west
    return (width, height) => {
      return {
        y: -(height / 5),
        x: -width
      }
    }
  }
  if (!directionsTaken.find(dir => dir[0] && !dir[1])) { // North west
    return (width, height) => {
      return {
        y: (-3 * height) / 4,
        x: -width
      }
    }
  }
  return (width, height) => { // Has to be northeast, since all other options have returned
    return {
      y: (-3 * height) / 4,
      x: 0
    }
  }
}

const AsyncGoogleMap = withScriptjs(withGoogleMap(({ routes, onMapMounted }) => {
  // Extract all airports in routes and filter away duplicate airports
  const airports = []
  routes.forEach((route) => {
    route.forEach((airport) => {
      if (airports.every(prevAirport => prevAirport.iata !== airport.iata)) {
        airports.push(airport)
      }
    })
  })
  const airportsWithPixelOffset = airports.map((airport) => {
    return { ...airport, getPixelPositionOffset: getPixelPositionOffset(airport, airports) }
  })

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
            return { lat: airport.lat, lng: airport.lng }
          })}
          options={{
            geodesic: true,
            strokeColor: "#B03030",
            strokeWeight: 2
          }}
          key={uniqueId()}
        />
      ))}
      {airportsWithPixelOffset.map(airport => (
        <div key={uniqueId()}>
          <Marker
            position={{ lat: airport.lat, lng: airport.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 2,
              strokeColor: "#D03030",
              strokeWeight: 3
            }}
          />
          <OverlayView
            position={{ lat: airport.lat, lng: airport.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={airport.getPixelPositionOffset}
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
          newBounds.extend(new LatLng(airport.lat, airport.lng))
        })
      })
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
