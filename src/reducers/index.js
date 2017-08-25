import { combineReducers } from "redux"
import routes from "./routes"
import airportData from "./airportData"
import error from "./error"
import map from "./map"
import inputMode from "./inputMode"
import settings from "./settings"
import mobile from "./mobile"
import url from "./url"
import searchInput from "./searchInput"
import svgMap from "./svgMap"

export default combineReducers({
  routes,
  airportData,
  error,
  map,
  inputMode,
  settings,
  mobile,
  url,
  searchInput,
  svgMap
})
