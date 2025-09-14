import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import greatCircle from '@turf/great-circle';
import { point as turfPoint } from '@turf/helpers';
import { LatLonSpherical } from 'geodesy';

import { getRoutes, getAirports, getSectors, getBrighterColor } from '../../selectors';

// Functional child to auto-fit bounds whenever routes change
function AutoFitBounds({ routes }) {
  const map = useMap();
  useEffect(() => {
    if (!Array.isArray(routes) || routes.length === 0) return;
    const points = [];
    const seen = new Set();
    routes.forEach(route => {
      if (!Array.isArray(route)) return;
      route.forEach(a => {
        if (!a || typeof a.lat !== 'number' || typeof a.lng !== 'number') return;
        const key = a.id || `${a.lat},${a.lng}`;
        if (seen.has(key)) return;
        seen.add(key);
        points.push([a.lat, a.lng]);
      });
    });
    if (points.length < 2) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [100, 100], maxZoom: 7 });
  }, [map, routes]);
  return null;
}

// Invalidate map size on initial mount to account for sidebar layout
function AutoInvalidateSize() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const raf = requestAnimationFrame(() => map.invalidateSize());
    const onLoad = () => map.invalidateSize();
    window.addEventListener('load', onLoad);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', onLoad);
    };
  }, [map]);
  return null;
}

class LeafletMap extends Component {
  render() {
    const { routes, routeColor, pointColor, airports, sectors, label } = this.props;

    function turfGreatCirclePositions(a, b, npoints = 128) {
      if (!a || !b) return [];
      const from = turfPoint([a.lng, a.lat]);
      const to = turfPoint([b.lng, b.lat]);
      const feature = greatCircle(from, to, { npoints });
      const { type, coordinates } = feature.geometry;
      if (type === 'LineString') {
        return [coordinates.map(([lng, lat]) => [lat, lng])];
      }
      if (type === 'MultiLineString') {
        return coordinates.map(line => line.map(([lng, lat]) => [lat, lng]));
      }
      return [];
    }

    function repeatAcrossDateline(positions, offsets = [-360, 0, 360]) {
      return offsets.map(offset => positions.map(([lat, lng]) => [lat, lng + offset]));
    }

    function repeatPointAcrossDateline(lat, lng, offsets = [-360, 0, 360]) {
      return offsets.map(offset => [lat, lng + offset]);
    }

    // Compute label direction similar to Google implementation
    const labelDirCache = new Map();
    function getLabelDirection(curAirport) {
      if (labelDirCache.has(curAirport.id)) return labelDirCache.get(curAirport.id);

      // Identify connected airports
      const linkedAirports = sectors
        .filter(sector => sector.find(ap => ap.id === curAirport.id))
        .map(sector => (sector[0].id === curAirport.id ? sector[1] : sector[0]));

      const curLocation = new LatLonSpherical(curAirport.lat, curAirport.lng);

      const bearings = linkedAirports.map(ap => {
        const badBearing = curLocation.bearingTo(new LatLonSpherical(ap.lat, ap.lng));
        if (badBearing < 90) return 'ne';
        if (badBearing < 180) return 'se';
        if (badBearing < 270) return 'sw';
        return 'nw';
      });

      const vectorProjections = airports
        .filter(ap => ap.id !== curAirport.id)
        .map(ap => {
          const loc = new LatLonSpherical(ap.lat, ap.lng);
          const distance = curLocation.distanceTo(loc) / 1000; // km
          const vectorLength = 10000 / (1000 + 4 * distance + distance ** 2.5 / 800);
          const vectorDirection = (90 - loc.rhumbBearingTo(curLocation)) * (Math.PI / 180);
          const northEastProj = vectorLength * Math.cos(vectorDirection - Math.PI / 4) ** 3;
          const northWestProj = vectorLength * Math.cos(vectorDirection - (3 * Math.PI) / 4) ** 3;
          return { northEastProj, northWestProj };
        });

      const directionalForces = vectorProjections.reduce(
        (acc, val) => {
          let northEast;
          let southWest;
          let northWest;
          let southEast;
          if (val.northEastProj > 0) {
            northEast = acc.northEast + val.northEastProj;
            southWest = acc.southWest - 6 * val.northEastProj;
          } else {
            northEast = acc.northEast + 6 * val.northEastProj;
            southWest = acc.southWest - val.northEastProj;
          }

          if (val.northWestProj > 0) {
            northWest = acc.northWest + val.northWestProj;
            southEast = acc.southEast - 6 * val.northWestProj;
          } else {
            northWest = acc.northWest + 6 * val.northWestProj;
            southEast = acc.southEast - val.northWestProj;
          }
          return { northEast, southWest, northWest, southEast };
        },
        { northEast: 0, southWest: 0, northWest: 0, southEast: 0 }
      );

      // Avoid directions where there is a line in the way
      if (bearings.includes('ne')) directionalForces.northEast -= 0.5;
      if (bearings.includes('se')) directionalForces.southEast -= 0.5;
      if (bearings.includes('sw')) directionalForces.southWest -= 0.5;
      if (bearings.includes('nw')) directionalForces.northWest -= 0.5;

      const direction = Object.keys(directionalForces).reduce((a, b) =>
        directionalForces[a] > directionalForces[b] ? a : b
      );
      labelDirCache.set(curAirport.id, direction);
      return direction;
    }

    // Choose base layer by mapType from router: 'satellite' -> imagery, else OSM
    const { mapType } = this.props;
    const isSatellite = mapType === 'satellite';
    const tileUrl = isSatellite
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileAttribution = isSatellite
      ? 'Tiles © Esri — Source: Esri, i‑cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR‑EGP, and the GIS User Community'
      : '&copy; OpenStreetMap contributors';

    return (
      <div id="map-container">
        <MapContainer
          id="map"
          center={[25, 0]}
          zoom={2.5}
          scrollWheelZoom
          zoomControl={false}
          zoomDelta={0.25}
          zoomSnap={0.25}
          wheelPxPerZoomLevel={120}
          style={{ width: '100%', height: '100%' }}
        >
          <AutoInvalidateSize />
          <AutoFitBounds routes={routes} />
          <TileLayer url={tileUrl} attribution={tileAttribution} />
          {Array.isArray(routes) &&
            routes.map(route => {
              if (!Array.isArray(route) || route.length < 2) return null;
              return route.slice(0, -1).flatMap((airport, idx) => {
                const nextAirport = route[idx + 1];
                const segments = turfGreatCirclePositions(airport, nextAirport);
                const repeated = segments.flatMap(positions => repeatAcrossDateline(positions));
                return repeated.map(positions => (
                  <Polyline
                    positions={positions}
                    pathOptions={{ color: routeColor, weight: 2, noClip: true }}
                  />
                ));
              });
            })}
          {Array.isArray(airports) &&
            airports.map(airport => {
              const pts = repeatPointAcrossDateline(airport.lat, airport.lng);
              const dir = getLabelDirection(airport);
              // Map diagonal direction to Leaflet tooltip direction + pixel offset
              const isEast = dir === 'northEast' || dir === 'southEast';
              const isNorth = dir === 'northEast' || dir === 'northWest';
              const tooltipDirection = isEast ? 'right' : 'left';
              const offset = [0, isNorth ? -15 : 15];
              const labelText = airport[label] || airport.iata || airport.icao;

              return pts.map(center => (
                <CircleMarker
                  center={center}
                  radius={3}
                  pathOptions={{
                    color: pointColor,
                    fillColor: pointColor,
                    weight: 1,
                    fillOpacity: 1,
                    noClip: true
                  }}
                >
                  {label !== 'none' && labelText ? (
                    <Tooltip
                      permanent
                      direction={tooltipDirection}
                      offset={offset}
                      opacity={1}
                      className="label-tooltip"
                    >
                      <div className="map-label">
                        <p>{labelText}</p>
                      </div>
                    </Tooltip>
                  ) : null}
                </CircleMarker>
              ));
            })}
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
    mapType: state.router.result.mapType,
    label: state.router.query.label || 'city',
    routeColor: state.router.query.color || '#d03030',
    pointColor: getBrighterColor(state)
  };
}

LeafletMap.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.array),
  sectors: PropTypes.arrayOf(PropTypes.array),
  airports: PropTypes.arrayOf(PropTypes.object),
  mapType: PropTypes.string,
  label: PropTypes.string,
  routeColor: PropTypes.string,
  pointColor: PropTypes.string
};

LeafletMap.defaultProps = {
  routes: null,
  sectors: null,
  airports: null,
  mapType: 'roadmap',
  label: 'city',
  routeColor: '#d03030',
  pointColor: '#ffffff'
};

export default connect(mapStateToProps)(LeafletMap);
