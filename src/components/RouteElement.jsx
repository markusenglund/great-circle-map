import React from "react"
import PropTypes from "prop-types"
import SectorElement from "./SectorElement"

function RouteElement({ route }) {
  const sectors = []
  for (let i = 1; i < route.length; i += 1) {
    sectors.push([route[i - 1], route[i]])
  }

  let id = 0
  return (
    <div className="route-element">
      {sectors.map(sector => (
        <SectorElement sector={sector} key={(id += 1)} />
      ))}
    </div>
  )
}

RouteElement.propTypes = {
  route: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default RouteElement
