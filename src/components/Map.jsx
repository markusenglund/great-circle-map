import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withGoogleMap, GoogleMap, Polyline, OverlayView } from "react-google-maps"
import withScriptjs from "react-google-maps/lib/async/withScriptjs"
import uniqueId from "lodash.uniqueid"
import { LatLonSpherical } from "geodesy"

import { getAirportData, completeMapLoad } from "../actionCreators"

function getPixelPositionOffset(curAirport, airports) {
  const curLocation = new LatLonSpherical(
    curAirport.lat, curAirport.lng
  )

  const vectorProjections = airports
    .filter(airport => airport.id !== curAirport.id)
    .map((airport) => {
      const location = new LatLonSpherical(airport.lat, airport.lng)
      const distance = curLocation.distanceTo(location) / 1000 // in km
      const vectorLength = 10000 / (1000 + (4 * distance) + ((distance ** 3) / 1000))
      const vectorDirection = (90 - location.rhumbBearingTo(curLocation)) * (Math.PI / 180)

      // TODO: When an airport1 is close and northwest of airport2 it get a little bit of
      // force to the northwest and MORE negative force southeast so it's negative sum
      const northEastProj = vectorLength * (Math.cos(vectorDirection - (Math.PI / 4)) ** 3)

      const northWestProj = vectorLength * (Math.cos(vectorDirection - ((3 * Math.PI) / 4)) ** 3)
      return { northEastProj, northWestProj }
    })

  const directionalForces = vectorProjections.reduce((acc, val) => {
    let northEast
    let southWest
    let northWest
    let southEast
    if (val.northEastProj > 0) {
      northEast = acc.northEast + val.northEastProj
      southWest = acc.southWest - (6 * val.northEastProj)
    } else {
      northEast = acc.northEast + (6 * val.northEastProj)
      southWest = acc.southWest - val.northEastProj
    }

    if (val.northWestProj > 0) {
      northWest = acc.northWest + val.northWestProj
      southEast = acc.southEast - (6 * val.northWestProj)
    } else {
      northWest = acc.northWest + (6 * val.northWestProj)
      southEast = acc.southEast - val.northWestProj
    }
    return { northEast, southWest, northWest, southEast }
  }, { northEast: 0, southWest: 0, northWest: 0, southEast: 0 })
  console.log(directionalForces)

  const direction = Object.keys(directionalForces).reduce((a, b) => {
    return directionalForces[a] > directionalForces[b] ? a : b
  })

  if (direction === "northEast") {
    return (width, height) => {
      return { x: 3, y: (-3 * height) / 4 }
    }
  } else if (direction === "northWest") {
    return (width, height) => {
      return { x: -width - 3, y: (-3 * height) / 4 }
    }
  } else if (direction === "southWest") {
    return (width, height) => {
      return { x: -width - 3, y: -(height / 5) }
    }
  }
  return (width, height) => { // South east
    return { x: 3, y: -(height / 5) }
  }
}

// TODO: Split up into its own file
const AsyncGoogleMap = withScriptjs(withGoogleMap((
  { routes, onMapMounted, mapType, label, zoom }
) => {
  // Extract all airports in routes and filter away duplicate airports
  const airports = []
  routes.forEach((route) => {
    route.forEach((airport) => {
      if (airports.every(prevAirport => prevAirport.id !== airport.id)) {
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
      zoom={zoom}
      defaultCenter={{ lat: 20, lng: 0 }}
      mapTypeId={mapType}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        fullscreenControl: false
      }}
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
      {airportsWithPixelOffset.map((airport) => {
        return (
          <div key={airport.id}>
            {/* <Marker
              position={{ lat: airport.lat, lng: airport.lng }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3,
                strokeWeight: 1,
                strokeColor: "#D03030",
                fillColor: "#D03030",
                fillOpacity: 1
              }}
            /> */}
            <OverlayView
              position={{ lat: airport.lat, lng: airport.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={() => { return { x: -4, y: -4 } }}
            >
              <svg>
                <circle cx="4" cy="4" r="3" fill="#D03030" stroke="#D03030" strokeWidth="1" />
              </svg>
            </OverlayView>
            {label !== "none" ? (
              <OverlayView
                position={{ lat: airport.lat, lng: airport.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={airport.getPixelPositionOffset}
              >
                <div className="map-label">
                  <p>{airport[label] || airport.iata || airport.icao}</p>
                </div>
              </OverlayView>
              ) : null
            }
          </div>
        )
      })}
    </GoogleMap>
  )
}))

class Map extends Component {
  componentDidUpdate() {
    // Change the viewport to fit the airports that have been rendered to the map.
    const { routes, shouldMapRebound, map } = this.props
    if (routes.length && shouldMapRebound) {
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
    const { dispatch, urlParam, isMapLoaded } = this.props
    if (map && !isMapLoaded) {
      dispatch(completeMapLoad(map))
      dispatch(getAirportData(urlParam))
    }
  }

  render() {
    const { routes, mapType, label, zoom } = this.props
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
        mapType={mapType}
        label={label}
        zoom={zoom}
      />
    )
  }
}
Map.propTypes = {
  dispatch: PropTypes.func.isRequired,
  routes: PropTypes.arrayOf(PropTypes.array).isRequired,
  urlParam: PropTypes.string,
  isMapLoaded: PropTypes.bool.isRequired,
  map: PropTypes.shape({ fitBounds: PropTypes.func }),
  shouldMapRebound: PropTypes.bool.isRequired,
  mapType: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  zoom: PropTypes.number.isRequired
}
Map.defaultProps = { urlParam: null, map: null }

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

export default connect(mapStateToProps)(Map)
