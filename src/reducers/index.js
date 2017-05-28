import { combineReducers } from "redux"
import routes from "./routes"
import airportData from "./airportData"
import error from "./error"

export default combineReducers({ routes, airportData, error })
