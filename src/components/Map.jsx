import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withGoogleMap, GoogleMap, Polyline, Marker, OverlayView } from "react-google-maps"
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
      const distance = curLocation.distanceTo(location)
      const vectorLength = distance > 50000 ? 1000000 / (distance ** 2) : 1000000 / (50000 ** 2)
      const vectorDirection = (90 - location.rhumbBearingTo(curLocation)) * (Math.PI / 180)
      // const northEastProj = vectorLength * Math.cos(vectorDirection - (Math.PI / 4))
      // const northWestProj = vectorLength * Math.cos(vectorDirection - ((3 * Math.PI) / 4))
      const xProj = vectorLength * Math.cos(vectorDirection)
      const yProj = vectorLength * Math.sin(vectorDirection)
      return { xProj, yProj }
    })
  const xSum = vectorProjections.reduce((acc, val) => acc + val.xProj, 0)
  const ySum = vectorProjections.reduce((acc, val) => acc + val.yProj, 0)

  return (width, height) => {
    return {
      y: ySum > 0 ? (-3 * height) / 4 : -(height / 5),
      x: xSum > 0 ? 0 : -width
    }
  }


  // FIXME: Could this be done in a more efficient way like Math.min?
  // TODO:
  // const airportsClone = JSON.parse(JSON.stringify(airports))
  // const airportsClone = airports
  //   .filter((airport) => {
  //     const location = new LatLonSpherical(airport.lat, airport.lng)
  //     const distance = airportLocation.distanceTo(location)
  //     return distance < 1500000 // 1500 km
  //   })
  //   .sort((a, b) => {
  //     const locationA = new LatLonSpherical(a.lat, a.lng)
  //     const locationB = new LatLonSpherical(b.lat, b.lng)
  //     const distanceA = airportLocation.distanceTo(locationA)
  //     const distanceB = airportLocation.distanceTo(locationB)
  //     return distanceA - distanceB
  //   })
  //
  // const directionsTaken = []
  // for (let i = 1; i < Math.min(airportsClone.length, 4); i += 1) {
  //   const direction = [
  //     airportsClone[i].lat - currentAirport.lat > 0,
  //     airportsClone[i].lng - currentAirport.lng > 0
  //   ]
  //   directionsTaken.push(direction)
  // }
  //
  // // If no nearby airports, render label to the southeast of the circle
  // if (directionsTaken.length < 1) {
  //   return (width, height) => {
  //     return {
  //       y: -(height / 5),
  //       x: 0
  //     }
  //   }
  // }
  //
  // // If there is no nearby airport in the opposite direction of the closest neighbor:
  // // Choose that direction for the label
  // if (!directionsTaken.find(dir =>
  //   dir[0] !== directionsTaken[0][0] && dir[1] !== directionsTaken[0][1]
  // )) {
  //   return (width, height) => {
  //     return {
  //       y: directionsTaken[0][0] ? -(height / 5) : (-3 * height) / 4,
  //       x: directionsTaken[0][1] ? -width : 0
  //     }
  //   }
  // }
  // if (!directionsTaken.find(dir => !dir[0] && dir[1])) { // South east
  //   return (width, height) => {
  //     return {
  //       y: -(height / 5),
  //       x: 0
  //     }
  //   }
  // }
  // if (!directionsTaken.find(dir => !dir[0] && !dir[1])) { // South west
  //   return (width, height) => {
  //     return {
  //       y: -(height / 5),
  //       x: -width
  //     }
  //   }
  // }
  // if (!directionsTaken.find(dir => dir[0] && !dir[1])) { // North west
  //   return (width, height) => {
  //     return {
  //       y: (-3 * height) / 4,
  //       x: -width
  //     }
  //   }
  // }
  // return (width, height) => { // Has to be northeast, since all other options have returned
  //   return {
  //     y: (-3 * height) / 4,
  //     x: 0
  //   }
  // }
  // return () => {
  //   return { y: 0, x: 0 }
  // }
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
        scaleControl: true,
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
            <Marker
              position={{ lat: airport.lat, lng: airport.lng }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 2,
                strokeColor: "#D03030",
                strokeWeight: 3
              }}
            />
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
