import React from "react"
import PropTypes from "prop-types"
import uniqueId from "lodash.uniqueid"


function CollapsibleElement({
  route, distancesInKmRounded, distances, distanceToTimeString, nonStopDistance, totalDistance, differenceParsed
}) {
  return (
    <div className="collapsible">
      <div>
        {route.map((airport, i) => (
          <div key={uniqueId()}>
            <div className="collapsible-airport">
              <div>{airport.city} ({airport.userEnteredCode})</div>
              <div className="collapsible-name">{airport.name}</div>
            </div>
            {distancesInKmRounded[i] ? (
              <div className="collapsible-distance">
                <i className="fa fa-arrow-down" aria-hidden="true" />
                <div>
                  <div className="grey">Distance</div>
                  <div className="bold">{distancesInKmRounded[i]} km</div>
                </div>
                <div className="duration">
                  <div className="grey">Duration</div>
                  <div className="bold">{distanceToTimeString(distances[i])}</div>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {route.length > 2 && route[0].iata !== route[route.length - 1].iata ? (
        <div className="total-distance">
          <div className="padding-4px">
            <div className="grey">Non-stop distance ({route[0].iata} - {route[route.length - 1].iata})</div>
            <div className="bold">{Math.round(nonStopDistance / 1000)} km</div>
          </div>
          <div className="padding-4px">
            <div className="grey">Distance added by stop-over{route.length > 3 ? <span>s</span> : null}</div>
            <div className="bold">{Math.round((totalDistance - nonStopDistance) / 1000)} km (+{differenceParsed})</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CollapsibleElement
