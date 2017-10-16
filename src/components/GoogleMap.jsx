import React from "react"
import { withGoogleMap, withScriptjs, GoogleMap, Polyline, OverlayView } from "react-google-maps"
import { LatLonSpherical } from "geodesy"

function getPixelPositionOffset(curAirport, airports, sectors) {
  // Identify which airports are connected to curAirport,
  const linkedAirports = sectors
    .filter(sector => sector.find(airport => airport.id === curAirport.id))
    .map(sector => (sector[0].id === curAirport.id ? sector[1] : sector[0]))

  const curLocation = new LatLonSpherical(
    curAirport.lat, curAirport.lng
  )

  const bearings = linkedAirports.map((airport) => {
    const badBearing = curLocation.bearingTo(new LatLonSpherical(airport.lat, airport.lng))
    if (badBearing < 90) {
      return "ne"
    } else if (badBearing < 180) {
      return "se"
    } else if (badBearing < 270) {
      return "sw"
    }
    return "nw"
  })

  const vectorProjections = airports
    .filter(airport => airport.id !== curAirport.id)
    .map((airport) => {
      const location = new LatLonSpherical(airport.lat, airport.lng)
      const distance = curLocation.distanceTo(location) / 1000 // in km
      const vectorLength = 10000 / (1000 + (4 * distance) + ((distance ** 2.5) / 800))
      const vectorDirection = (90 - location.rhumbBearingTo(curLocation)) * (Math.PI / 180)

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

  // Avoid directions where there is a line in the way
  if (bearings.includes("ne")) {
    directionalForces.northEast -= 0.5
  }
  if (bearings.includes("se")) {
    directionalForces.southEast -= 0.5
  }
  if (bearings.includes("sw")) {
    directionalForces.southWest -= 0.5
  }
  if (bearings.includes("nw")) {
    directionalForces.northWest -= 0.5
  }

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

const AsyncGoogleMap = withScriptjs(withGoogleMap((
  {
    routes,
    airports,
    sectors,
    onMapMounted,
    mapType,
    label,
    zoom,
    isMapLoaded,
    routeColor,
    pointColor
  }
) => {
  const airportsWithPixelOffset = airports.map((airport) => {
    return {
      ...airport,
      getPixelPositionOffset: getPixelPositionOffset(airport, airports, sectors)
    }
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
            strokeColor: routeColor,
            strokeWeight: 2
          }}
          key={route.id}
        />
      ))}
      {isMapLoaded && airportsWithPixelOffset.map((airport) => {
        return (
          <div key={airport.id}>
            <OverlayView
              position={{ lat: airport.lat, lng: airport.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={() => { return { x: -4, y: -4 } }}
            >
              <svg>
                <circle cx="4" cy="4" r="3" fill={pointColor} stroke={pointColor} strokeWidth="1" />
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

export default AsyncGoogleMap
