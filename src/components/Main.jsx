import React from "react"
import Map from "./Map"
import RouteInput from "./RouteInput"
import RouteList from "./RouteList"

function Main() {
  return (
    <div>
      <div id="main-flexbox">
        <div className="left-column">
          <RouteInput />
          <RouteList />
        </div>
        <Map />
      </div>
    </div>
  )
}

export default Main
