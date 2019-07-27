import { createSelector } from 'reselect';
import parseStringWithSlashes from '../utils/parseStringWithSlashes';

/*  HELPER FUNCTIONS  */

function hasForbiddenCharacter(inputString) {
  const invalidSymbolsRegex = /[^A-Za-z,;/-\s\d]/;
  const invalidSymbol = invalidSymbolsRegex.exec(inputString);
  // returns undefined if no invalid symbol is found
  return invalidSymbol;
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

function getAirportData(state) {
  return state.airportData;
}

function getRouteString(state) {
  return state.router.query.routes;
}

/* MAIN FUNCTION */

const getRoutes = createSelector(
  [getAirportData, getRouteString],
  (airportData, routeString) => {
    if (!routeString || airportData.length === 0) {
      return { routes: [], error: null };
    }

    // Make string all uppercase and remove spaces and dangling comma, semi-colon or slash
    const parsedRouteString = routeString
      .toUpperCase()
      .replace(/ /g, '')
      .replace(/[,;/\n]$/, '');

    // Check for forbidden characters in input
    const forbiddenCharacter = hasForbiddenCharacter(parsedRouteString);
    if (forbiddenCharacter) {
      return {
        routes: null,
        error: `'${forbiddenCharacter}' is not a valid character`
      };
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
        return { routes: null, error: 'Unable to parse input' };
      } else if (codeWithWrongLength) {
        return {
          routes: null,
          error: `'${codeWithWrongLength}' is not a valid airport code`
        };
      }
    }

    const { error, detailedRoutes } = codes2DetailedRoutes(routeArray, airportData);
    if (error) {
      return { routes: null, error: error.message };
    }

    return { routes: detailedRoutes, error: null };
  }
);

export default getRoutes;
