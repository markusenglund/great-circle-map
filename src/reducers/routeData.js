const routes = (state = { routes: [], sectors: [], airports: [] }, action) => {
  switch (action.type) {
    case "SUBMIT_ROUTES": {
      // Calculate sectors and array of airports
      const airports = []
      const sectors = []
      action.routes.forEach((route) => {
        route.forEach((airport) => {
          if (airports.every(prevAirport => prevAirport.id !== airport.id)) {
            airports.push(airport)
          }
        })
        for (let i = 1; i < route.length; i += 1) {
          sectors.push([route[i - 1], route[i]])
        }
      })
      return { routes: action.routes, sectors, airports }
    }
    default:
      return state
  }
}

export default routes
