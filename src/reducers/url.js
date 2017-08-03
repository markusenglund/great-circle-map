const url = (state = { param: "", history: null }, action) => {
  switch (action.type) {
    case "DECODE_URL": {
      if (action.param) {
        return { param: decodeURIComponent(action.param), history: action.history }
      }
      return { param: "", history: action.history }
    }
    default:
      return state
  }
}

export default url
