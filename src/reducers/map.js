const map = (state = { isLoaded: false }, action) => {
  switch (action.type) {
    case "COMPLETE_MAP_LOAD": {
      return { isLoaded: true }
    }
    default:
      return state
  }
}

export default map
