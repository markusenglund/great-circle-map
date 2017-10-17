/*  HELPER FUNCTIONS  */

function hasForbiddenCharacter(inputString) {
  const invalidSymbolsRegex = /[^A-Za-z,;/-\s\d]/;
  const invalidSymbol = invalidSymbolsRegex.exec(inputString);
  // returns undefined if no invalid symbol is found
  return invalidSymbol;
}

// Helper function for splitting routes with slashes into separate routes
// Is exported to be used in different context
export function parseStringWithSlashes(string) {
  // ex str = ["LHR/DUB-JFK"]
  const wordWithSlashesRegex = /[\w/]*\/[\w/]*/;
  const routeArray = string
    .match(wordWithSlashesRegex)[0] // ex ["LHR/DUB"]
    .split(/\//g)
    .map(part => string.replace(wordWithSlashesRegex, part));
  return routeArray;
}

// Takes array of arrays of airportcodes, returns array of arrays of airports w coordinates, name...
// If any of the airportcodes does not exist in db, an error message is returned instead
function codes2DetailedRoutes(routeArr, airportData) {
  try {
    const detailedRoutes = routeArr.map(route => {
      const detailedRoute = route.map(airportCode => {
        let myAirport;
        // if iata-code
        if (airportCode.length === 3) {
          myAirport = airportData.find(airport => airport.iata === airportCode);
          // if icao-code
        } else if (airportCode.length === 4) {
          myAirport = airportData.find(airport => airport.icao === airportCode);
        }
        if (!myAirport) {
          throw new Error(`'${airportCode}' does not exist in our database`);
        }
        return { ...myAirport, userEnteredCode: airportCode };
      });
      detailedRoute.id = detailedRoute.reduce((acc, airport, i) => {
        return i ? `${acc}-${airport.id}` : `${airport.id}`;
      }, '');
      return detailedRoute;
    });
    return { detailedRoutes };
  } catch (error) {
    return { error };
  }
}

/* MAIN FUNCTION */

// This is the action creator that gets called when new url is passed
// Dispatches either an error (if url is invalid input) or the paths of the routes
export default function getRoutesFromUrl() {
  return (dispatch, getState) => {
    const { router } = getState();
    const routeString = decodeURIComponent(router.location.pathname.slice(1));
    if (routeString === '') {
      return dispatch({ type: 'SUBMIT_ROUTES', routes: [] });
    }

    // Make string all uppercase and remove spaces and dangling comma, semi-colon or slash
    const parsedRouteString = routeString
      .toUpperCase()
      .replace(/ /g, '')
      .replace(/[,;/\n]$/, '');

    // Check for forbidden characters in input
    const forbiddenCharacter = hasForbiddenCharacter(parsedRouteString);
    if (forbiddenCharacter) {
      return dispatch({
        type: 'SHOW_ERROR',
        error: `'${forbiddenCharacter}' is not a valid character`
      });
    }

    // Split route-string by commas into an array
    // and separate routes with slashes so they create new routes
    // This is an array of routes, which in turn are arrays of airport-codes
    const routeArray = parsedRouteString
      .split(/[,;\n]+/g)
      .reduce((acc, val) => {
        if (/\//.test(val)) {
          return acc.concat(parseStringWithSlashes(val));
        }
        return acc.concat(val);
      }, [])
      .map(route => route.split('-'));

    // Check if any route contains an airport code that isn't the right length, dispatch error
    for (let i = 0; i < routeArray.length; i += 1) {
      const codeWithWrongLength = routeArray[i].find(airportCode => {
        return airportCode.length !== 3 && airportCode.length !== 4;
      });
      if (codeWithWrongLength === '') {
        return dispatch({ type: 'SHOW_ERROR', error: 'Unable to parse input' });
      } else if (codeWithWrongLength) {
        return dispatch({
          type: 'SHOW_ERROR',
          error: `'${codeWithWrongLength}' is not a valid airport code`
        });
      }
    }

    const { airportData } = getState();
    const { error, detailedRoutes } = codes2DetailedRoutes(routeArray, airportData);
    if (error) {
      return dispatch({ type: 'SHOW_ERROR', error: error.message });
    }

    dispatch({ type: 'SUBMIT_ROUTES', routes: detailedRoutes });
    return dispatch({ type: 'HIDE_ERROR' });
  };
}
