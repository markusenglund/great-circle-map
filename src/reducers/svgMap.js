const svgMap = (state = {}, action) => {
  switch (action.type) {
    case "GET_SVG_MAP": {
      return action.data
    }
    default:
      return state
  }
}

export default svgMap
