const mobile = (state = false, action) => {
  switch (action.type) {
    case "IS_MOBILE": {
      return true
    }
    default:
      return state
  }
}

export default mobile
