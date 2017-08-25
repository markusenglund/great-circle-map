const globePosition = (state = {
  mouseDownLambda: null,
  mouseDownPhi: null,
  lambda: 0,
  phi: 0
}, action) => {
  switch (action.type) {
    case "MOUSE_DOWN": {
      return {
        ...state,
        mouseDownLambda: action.mouseDownLambda,
        mouseDownPhi: action.mouseDownPhi
      }
    }
    case "MOUSE_MOVE": {
      return state
    }
    case "MOUSE_UP": {
      return state
    }
    case "CHANGE_REFERENCE_PHI": {
      return { ...state, mouseDownPhi: action.mouseDownPhi }
    }
    default:
      return state
  }
}

export default globePosition
