const settings = (
  state = {
    map: 'google',
    mapType: 'satellite',
    routeColor: '#d03030',
    distanceUnit: { abbr: 'km', readable: 'Kilometers' },
    label: { value: 'city', readable: 'City name' },
    buttonsVisible: true
  },
  action
) => {
  switch (action.type) {
    case 'CHANGE_MAP': {
      return { ...state, map: action.map };
    }
    case 'CHANGE_MAP_TYPE': {
      // Should be change to CHANGE_GOOGLE_MAP_TYPE
      return { ...state, mapType: action.mapType };
    }
    case 'CHANGE_DISTANCE_UNIT': {
      return { ...state, distanceUnit: action.distanceUnit };
    }
    case 'CHANGE_LABEL': {
      return { ...state, label: action.label };
    }
    case 'TOGGLE_BUTTON_VISIBILITY': {
      return { ...state, buttonsVisible: action.visible };
    }
    case 'CHANGE_ROUTE_COLOR': {
      return { ...state, routeColor: action.color };
    }
    default:
      return state;
  }
};

export default settings;
