import Papa from "papaparse"
import getRoutesFromUrl from "./getRoutesFromUrl"

export default function getAirportData() {
  return (dispatch, getState) => {
    const { airportData, url } = getState()

    if (airportData.length === 0) {
      Papa.parse("/airports.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          dispatch({
            type: "RECEIVE_AIRPORT_DATA",
            data: results.data
          })
          if (url.param) {
            dispatch(getRoutesFromUrl(url.param))
          }
        }
      })
    }
  }
}
