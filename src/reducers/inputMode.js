const inputMode = (state = "advanced", action) => {
  switch (action.type) {
    case "CHANGE_INPUT_MODE": {
      return action.mode
    }
    default:
      return state
  }
}

export default inputMode
