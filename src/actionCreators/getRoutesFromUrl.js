/**  HELPER FUNCTIONS  **/

function hasForbiddenCharacter(inputString) {
  const invalidSymbolsRegex = /[^A-Za-z,;/-\s\d]/
  const invalidSymbol = invalidSymbolsRegex.exec(inputString)
  // returns undefined if no invalid symbol is found
  return invalidSymbol
}

// Helper function for splitting routes with slashes into separate routes
// Is exported to be used in different context
export function parseStringWithSlashes(str) { // ex str = ["LHR/DUB-JFK"]
  const wordWithSlashes = /[\w/]*\/[\w/]*/
  const slashString = str.match(wordWithSlashes)[0] // ex ["LHR/DUB"]
  const slashArray = slashString.split(/\//g) // ex ["LHR", "DUB"]
  const routeArray = slashArray.map(part => str.replace(wordWithSlashes, part))
  return routeArray
}

// Takes array of arrays of airportcodes, returns array of arrays of airports w coordinates, name...
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
        return { ...myAirport, userEnteredCode: airportCode }
      })
    })
    return { routes }
  } catch (error) {
    return { error }
  }
}

/** MAIN FUNCTION **/

// This is the action creator that gets called when new url is passed
// Dispatches either an error (if url is invalid input) or the paths of the routes
export default function getRoutesFromUrl() {
  return (dispatch, getState) => {
    const { url } = getState()
    const routeStr = url.param
    // if (routeStr === "") {
    if (url.param === "") {
      return dispatch({ type: "SUBMIT_ROUTES", routes: [] })
    }

    // Make string all uppercase and remove spaces
    const routeStrAllCaps = routeStr.toUpperCase()
    const routeStrWithoutSpaces = routeStrAllCaps.replace(/ /g, "")

    // Remove dangling comma, semi-colon or slash
    const routeStrNoDangle = routeStrWithoutSpaces.replace(/[,;/\n]$/, "")

    // Check for forbidden characters in input
    const forbiddenCharacter = hasForbiddenCharacter(routeStrNoDangle)
    if (forbiddenCharacter) {
      return dispatch({ type: "SHOW_ERROR", error: `'${forbiddenCharacter}' is not a valid character` })
    }

    // Split route-string by commas into an array
    const routeArr = routeStrNoDangle.split(/[,;\n]+/g)
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
        return airportCode.length !== 3 && airportCode.length !== 4
      })
      if (codeWithWrongLength === "") {
        return dispatch({ type: "SHOW_ERROR", error: "Unable to parse input" })
      } else if (codeWithWrongLength) {
        return dispatch({ type: "SHOW_ERROR", error: `'${codeWithWrongLength}' is not a valid airport code` })
      }
    }

    const { airportData } = getState()
    const { error, routes } = codes2coords(routesSplitIntoAirportCodes, airportData)
    if (error) {
      return dispatch({ type: "SHOW_ERROR", error: error.message })
    }
    dispatch({ type: "SUBMIT_ROUTES", routes })
    return dispatch({ type: "HIDE_ERROR" })
  }
}
