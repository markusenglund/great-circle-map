const settings = (state = {
  mapType: { type: "satellite", readable: "Satellite" },
  distanceUnit: { abbr: "km", readable: "Kilometers" },
  label: { value: "iata", readable: "IATA code" },
  buttonsVisible: true
}, action) => {
  switch (action.type) {
    case "CHANGE_MAP_TYPE": {
      return { ...state, mapType: action.mapType }
    }
    case "CHANGE_DISTANCE_UNIT": {
      return { ...state, distanceUnit: action.distanceUnit }
    }
    case "CHANGE_LABEL": {
      return { ...state, label: action.label }
    }
    case "TOGGLE_BUTTON_VISIBILITY": {
      return { ...state, buttonsVisible: action.visible }
    }
    default:
      return state
  }
}

export default settings
