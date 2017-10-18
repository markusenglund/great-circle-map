import { createSelector } from 'reselect';
import { geoBounds } from 'd3-geo';
import getRoutes from './getRoutes';

export const getAirports = createSelector([getRoutes], ({ routes }) => {
  const airports = [];
  routes.forEach(route => {
    route.forEach(airport => {
      if (airports.every(prevAirport => prevAirport.id !== airport.id)) {
        airports.push(airport);
      }
    });
  });
  return airports;
});

export const getSectors = createSelector([getRoutes], ({ routes }) => {
  const sectors = [];
  routes.forEach(route => {
    for (let i = 1; i < route.length; i += 1) {
      sectors.push([route[i - 1], route[i]]);
    }
  });
  return sectors;
});

export const getGlobePosition = createSelector([getSectors], sectors => {
  let centerLng = 0;
  let centerLat = 0;
  if (sectors.length) {
    const lineStringCoords = sectors.map(sector => {
      return [[sector[0].lng, sector[0].lat], [sector[1].lng, sector[1].lat]];
    });
    const multiLineString = {
      type: 'MultiLineString',
      coordinates: lineStringCoords
    };
    const boundingBox = geoBounds(multiLineString);
    if (boundingBox[0][0] <= boundingBox[1][0]) {
      centerLng = (boundingBox[0][0] + boundingBox[1][0]) / 2;
    } else {
      centerLng = (boundingBox[0][0] + (boundingBox[1][0] + 360)) / 2;
    }

    if (centerLat < -65) {
      centerLat = -65;
    } else if (centerLat > 65) {
      centerLat = 65;
    } else {
      centerLat = (boundingBox[0][1] + boundingBox[1][1]) / 2;
    }
  }
  return { centerLng, centerLat };
});
