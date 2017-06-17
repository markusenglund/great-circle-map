import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withGoogleMap, GoogleMap, Polyline, Marker, OverlayView } from "react-google-maps"
import withScriptjs from "react-google-maps/lib/async/withScriptjs"
import uniqueId from "lodash.uniqueid"
import { LatLonSpherical } from "geodesy"

import { getAirportData, completeMapLoad } from "../actionCreators"

// FIXME: THIS IS CALLED WHENEVER A PERSON MOVES THE MAP. FIX!!!!!
function getPixelPositionOffset(width, height, currentAirport, airports) {
  const airportLocation = new LatLonSpherical(
    Number(currentAirport.lat), Number(currentAirport.lng)
  )
  const airportsClone = JSON.parse(JSON.stringify(airports)) // USe min to avoid this possibly expensive op
  airportsClone.sort((a, b) => { // This is computationally inefficient use min instead
    const locationA = new LatLonSpherical(Number(a.lat), Number(a.lng))
    const locationB = new LatLonSpherical(Number(b.lat), Number(b.lng))
    const distanceA = airportLocation.distanceTo(locationA)
    const distanceB = airportLocation.distanceTo(locationB)
    return distanceA - distanceB
  })

  const directionsTaken = []
  for (let i = 1; i < Math.min(airportsClone.length, 4); i += 1) {
    const direction = [
      Number(airportsClone[i].lat) - Number(currentAirport.lat) > 0,
      Number(airportsClone[i].lng) - Number(currentAirport.lng) > 0
    ]
    directionsTaken.push(direction)
  }

  let y
  let x

  if (!directionsTaken.find(direction =>
    direction[0] !== directionsTaken[0][0] && direction[1] !== directionsTaken[0][1]
  )) {
    y = directionsTaken[0][0] ? -(height / 5) : (-3 * height) / 4
    x = directionsTaken[0][1] ? -width : 0
  } else if (!directionsTaken.find(dir => !dir[0] && dir[1])) { // South east
    y = -(height / 5)
    x = 0
  } else if (!directionsTaken.find(dir => !dir[0] && !dir[1])) { // South west
    y = -(height / 5)
    x = -width
  } else if (!directionsTaken.find(dir => dir[0] && !dir[1])) { // North west
    y = (-3 * height) / 4
    x = -width
  } else { // North east
    y = (-3 * height) / 4
    x = 0
  }

  // const y = Number(airportsClone[1].lat) - Number(currentAirport.lat) > 0 ?
  //   -(height / 5) : (-3 * height) / 4
  // const x = Number(airportsClone[1].lng) - Number(currentAirport.lng) > 0 ?
  //   -width : 0
  return { x, y }
}

const AsyncGoogleMap = withScriptjs(withGoogleMap(({ routes, onMapMounted }) => {
  // Extract all airports in routes and filter duplicate airports
  const airports = []
  routes.forEach((route) => {
    route.forEach((airport) => {
      if (airports.every(prevAirport => prevAirport.iata !== airport.iata)) {
        airports.push(airport)
      }
    })
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
            getPixelPositionOffset={(w, h) => getPixelPositionOffset(w, h, airport, airports)}
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
