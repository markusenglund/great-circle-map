import React from "react"
import PropTypes from "prop-types"

function SectorElement({ sector, distance }) {
  return (
    <div className="sector-element">
      <span className="airport-code">{`${sector[0].userEnteredCode} - ${sector[1].userEnteredCode}`}</span>
      <span className="distance-number">{distance} km</span>
    </div>
  )
}

SectorElement.propTypes = {
  sector: PropTypes.arrayOf(PropTypes.object).isRequired,
  distance: PropTypes.number.isRequired
}

export default SectorElement
