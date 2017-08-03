import Papa from "papaparse"
import getRoutesFromUrl from "./getRoutesFromUrl"

export default function getAirportData(urlParam) {
  return (dispatch, getState) => {
    const { airportData } = getState()

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
          if (urlParam) {
            dispatch(getRoutesFromUrl(urlParam))
          }
        }
      })
    }
  }
}
