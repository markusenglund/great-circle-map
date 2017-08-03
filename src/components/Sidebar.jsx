import React from "react"
import Header from "./Header"
import RouteInput from "./RouteInput"
import RouteList from "./RouteList"

function Sidebar(isMobile, decodedUrlParam) {
  return (
    <div className="left-column">
      {!isMobile ? <Header /> : null}
      <RouteInput urlParam={decodedUrlParam} history={history} />
      <RouteList urlParam={decodedUrlParam} history={history} />
    </div>
  )
}

export default Sidebar
