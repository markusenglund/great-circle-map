import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash.uniqueid';
import { FaArrowDown } from 'react-icons/fa';

function distanceToTimeString(distance) {
  const seconds = distance / 257.25 + 15 * 60; // 257.25 = Mach 0.75 expressed in meters / second
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function CollapsibleElement({
  route,
  label,
  distances,
  readableSectorDistances,
  readableDistanceDifference,
  readableDifferencePercentage,
  readableNonStopDistance
}) {
  return (
    <div className="collapsible">
      <div>
        {route.map((airport, i) => (
          <div key={uniqueId()}>
            <div className="collapsible-airport">
              <div>
                {airport.city} (
                {label === 'icao' ? airport.icao || airport.iata : airport.iata || airport.icao})
              </div>
              <div className="collapsible-name">{airport.name}</div>
            </div>
            {readableSectorDistances[i] !== undefined ? (
              <div className="collapsible-distance">
                <FaArrowDown />
                {/* <i className="fa fa-arrow-down" aria-hidden="true" /> */}
                {readableSectorDistances[i] ? (
                  <div>
                    <div className="distance-label">Distance</div>
                    <div className="bold">{readableSectorDistances[i]}</div>
                  </div>
                ) : null}
                {readableSectorDistances[i] ? (
                  <div className="duration">
                    <div className="distance-label">Time (est.)</div>
                    <div className="bold">{distanceToTimeString(distances[i])}</div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {route.length > 2 && route[0].id !== route[route.length - 1].id ? (
        <div className="total-distance">
          <div className="padding-4px">
            <div className="distance-label">
              Non-stop distance
              {label === 'icao'
                ? ` (${route[0].icao || route[0].iata} - ${route[route.length - 1].icao ||
                    route[route.length - 1].iata})`
                : ` (${route[0].iata || route[0].icao} - ${route[route.length - 1].iata ||
                    route[route.length - 1].icao})`}
            </div>
            <div className="bold">{readableNonStopDistance}</div>
          </div>
          <div className="padding-4px">
            <div className="distance-label">
              Distance added by stop-over{route.length > 3 ? <span>s</span> : null}
            </div>
            <div className="bold">
              {readableDistanceDifference} (+{readableDifferencePercentage})
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

CollapsibleElement.propTypes = {
  route: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  label: PropTypes.string.isRequired,
  distances: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  readableSectorDistances: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  readableDistanceDifference: PropTypes.string.isRequired,
  readableDifferencePercentage: PropTypes.string.isRequired,
  readableNonStopDistance: PropTypes.string.isRequired
};

export default CollapsibleElement;
