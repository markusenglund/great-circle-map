const airportData = (state = [], action) => {
  switch (action.type) {
    case "RECEIVE_AIRPORT_DATA":
      if (state.length > 0) {
        console.log("CODE RED: AIRPORT DATA LOADED TWICE SOMETHING IS VERY WRONG!!!!!")
        throw new Error("AIRPORT DATA LOADED TWICE")
      }
      return action.data
    default:
      return state
  }
}

export default airportData
