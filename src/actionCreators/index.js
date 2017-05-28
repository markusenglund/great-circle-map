import Papa from "papaparse"
// TODO: Split this up into multiple action creators?

export function receiveAirportData(data) {
  return { type: "RECEIVE_AIRPORT_DATA", data }
}

export function getAirportData() {
  return (dispatch) => {
    Papa.parse("/airports.csv", {
      download: true,
      header: true,
      complete: (results) => {
        dispatch(receiveAirportData(results.data))
      }
    })
  }
}

export function submitRoutes(routes) {
  return { type: "SUBMIT_ROUTES", routes }
}

export function showError(error) {
  return { type: "SHOW_ERROR", error }
}

export function hideError() {
  return { type: "HIDE_ERROR" }
}

/**  Logic transforming input-string to route coordinates  **/

function hasForbiddenCharacter(inputString) {
  const invalidSymbolsRegex = /[^A-Za-z,;&/-\s]/
  const invalidSymbol = invalidSymbolsRegex.exec(inputString)
  // returns undefined if no invalid symbol is found
  return invalidSymbol
}

// Helper function for splitting routes with slashes into separate routes
function parseStringWithSlashes(str) { // ex str = ["LHR/DUB-JFK"]
  const wordWithSlashes = /[\w/]*\/[\w/]*/
  const slashString = str.match(wordWithSlashes)[0] // ex ["LHR/DUB"]
  const slashArray = slashString.split(/\//g) // ex ["LHR", "DUB"]
  const routeArray = slashArray.map(part => str.replace(wordWithSlashes, part))
  return routeArray
}

// Takes an array of arrays of airportcodes, returns an array of arrays of coordinates
// If any of the airportcodes does not exist in db, an error message is returned instead
function codes2coords(routeArr, airportData) {
  try {
    const routes = routeArr.map((route) => {
      return route.map((airportCode) => {
        let myAirport
        // if iata-code
        if (airportCode.length === 3) {
          myAirport = airportData.find(airport => airport.iata === airportCode)
          // if icao-code
        } else if (airportCode.length === 4) {
          myAirport = airportData.find(airport => airport.icao === airportCode)
        }
        if (!myAirport) {
          throw new Error(`'${airportCode}' does not exist in our database`)
        }
        return myAirport
      })
    })
    return { routes }
  } catch (error) {
    return { error }
  }
}

// This is the action creator that gets called when a user submits the routes-input
// Dispatches either an error (if input is invalid) or the paths of the routes
export function handleRoutes(routeStr) {
  return (dispatch, getState) => {
    // Make string all uppercase and remove spaces
    const routeStrAllCaps = routeStr.toUpperCase()
    const routeStrWithoutSpaces = routeStrAllCaps.replace(/ /g, "")

    // Check for forbidden characters in input
    const forbiddenCharacter = hasForbiddenCharacter(routeStrWithoutSpaces)
    if (forbiddenCharacter) {
      return dispatch(showError(`'${forbiddenCharacter}' is not a valid character`))
    }

    // Split route-string by commas into an array
    const routeArr = routeStrWithoutSpaces.split(/[,;&\n]+/g)
    // Separate routes slashes so they create new routes
    const routeArrWithParsedSlashes = routeArr.reduce((acc, val) => {
      if ((/\//).test(val)) {
        return acc.concat(parseStringWithSlashes(val))
      }
      return acc.concat(val)
    }, [])

    // This is an array of routes, which in turn are arrays of airport-codes
    const routesSplitIntoAirportCodes = routeArrWithParsedSlashes.map(route => route.split("-"))

    // Check if any route contains an airport code that isn't the right length, dispatch error
    for (let i = 0; i < routesSplitIntoAirportCodes.length; i += 1) {
      const codeWithWrongLength = routesSplitIntoAirportCodes[i].find((airportCode) => {
        return airportCode.length !== (3 || 4)
      })
      if (codeWithWrongLength === "") {
        return dispatch(showError("Unable to parse input"))
      } else if (codeWithWrongLength) {
        return dispatch(showError(`'${codeWithWrongLength}' is not a valid airport code`))
      }
    }

    const { airportData } = getState()

    const { error, routes } = codes2coords(routesSplitIntoAirportCodes, airportData)
    if (error) {
      dispatch(showError(error.message))
    } else {
      dispatch(submitRoutes(routes))
      dispatch(hideError())
    }
  }
}
