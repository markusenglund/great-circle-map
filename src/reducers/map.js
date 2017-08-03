const map = (state = { map: null, isLoaded: false, shouldMapRebound: true, zoom: 2 }, action) => {
  switch (action.type) {
    case "COMPLETE_MAP_LOAD": {
      return { ...state, isLoaded: true, map: action.map }
    }
    case "DISABLE_MAP_REBOUND":
      return { ...state, shouldMapRebound: false }
    case "ENABLE_MAP_REBOUND":
      return { ...state, shouldMapRebound: true }
    // case "ZOOM":
    //   return { ...state, zoom: action.level }
    default:
      return state
  }
}

export default map
