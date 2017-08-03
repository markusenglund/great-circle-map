import React from "react"
import PropTypes from "prop-types"

function SectorElement({ sector, distance, label }) {
  return (
    <div className="sector-element">
      <span className="airport-code">
        {label === "icao" ?
          <span>
            {sector[0].icao || sector[0].iata} &#8702; {sector[1].icao || sector[1].iata}
          </span> :
          <span>
            {sector[0].iata || sector[0].icao} &#8702; {sector[1].iata || sector[1].icao}
          </span>
        }
      </span>
      <span className="distance-number">{distance}</span>
    </div>
  )
}

SectorElement.propTypes = {
  sector: PropTypes.arrayOf(PropTypes.object).isRequired,
  distance: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}

export default SectorElement
