const airportData = (state = [], action) => {
  switch (action.type) {
    case "RECEIVE_AIRPORT_DATA":
      return action.data
    default:
      return state
  }
}

export default airportData
