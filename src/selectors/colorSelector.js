import { createSelector } from 'reselect';

function getRouteColor(state) {
  return state.settings.routeColor;
}

/* eslint-disable import/prefer-default-export */
export const getBrighterColor = createSelector([getRouteColor], routeColor => {
  let newColor = '#';
  for (let i = 1; i < 6; i += 2) {
    const number = parseInt(routeColor.substr(i, 2), 16);
    const newNumber = Math.round(Math.min(number + 20, 255)).toString(16);
    newColor += newNumber;
  }
  return newColor;
});
