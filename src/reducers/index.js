import { combineReducers } from "redux"
import routes from "./routes"
import airportData from "./airportData"
import error from "./error"
import map from "./map"

export default combineReducers({ routes, airportData, error, map })
