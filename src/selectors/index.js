import { createSelector } from "reselect"
import calculateGlobePosition from "../utils/calculateGlobePosition"

function getRoutes(state) {
  return state.routes
}

export const getAirports = createSelector([getRoutes], (routes) => {
  const airports = []
  routes.forEach((route) => {
    route.forEach((airport) => {
      if (airports.every(prevAirport => prevAirport.id !== airport.id)) {
        airports.push(airport)
      }
    })
  })
  return airports
})

export const getSectors = createSelector([getRoutes], (routes) => {
  const sectors = []
  routes.forEach((route) => {
    for (let i = 1; i < route.length; i += 1) {
      sectors.push([route[i - 1], route[i]])
    }
  })
  return sectors
})

export const getGlobePosition = createSelector([getSectors], (sectors) => {
  return calculateGlobePosition(sectors)
})
