import React from "react"
import PropTypes from "prop-types"
import { LatLonEllipsoidal } from "geodesy"

function SectorElement({ sector }) {
  const p1 = new LatLonEllipsoidal(Number(sector[0].lat), Number(sector[0].lng))
  const p2 = new LatLonEllipsoidal(Number(sector[1].lat), Number(sector[1].lng))
  const distanceInMeters = p1.distanceTo(p2)
  const distanceInKmRounded = Math.round(distanceInMeters / 1000)
  return (
    <div>
      <span>{`${sector[0].iata} - ${sector[1].iata}`}</span>
      <span className="distance-number">{distanceInKmRounded} km</span>
    </div>
  )
}

SectorElement.propTypes = {
  sector: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default SectorElement
