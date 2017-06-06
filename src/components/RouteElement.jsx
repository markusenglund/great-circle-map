import React, { Component } from "react"
import PropTypes from "prop-types"
import { LatLonEllipsoidal } from "geodesy"
import { Collapse } from "react-collapse"
import uniqueId from "lodash.uniqueid"
import SectorElement from "./SectorElement"
import CollapsibleElement from "./CollapsibleElement"

function distanceToTimeString(distance) {
  const seconds = (distance / 257.25) + (15 * 60) // 257.25 = Mach 0.75 expressed in meters / second
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

class RouteElement extends Component {
  constructor() {
    super()
    this.state = { isOpened: false }
  }

  toggleCollapsible() {
    this.setState({ isOpened: !this.state.isOpened })
  }

  render() {
    const { route, index } = this.props
    const style = index ? { borderTop: "1px #ccc solid" } : null

    const sectors = []
    for (let i = 1; i < route.length; i += 1) {
      sectors.push([route[i - 1], route[i]])
    }
    const distances = sectors.map((sector) => {
      const p1 = new LatLonEllipsoidal(Number(sector[0].lat), Number(sector[0].lng))
      const p2 = new LatLonEllipsoidal(Number(sector[1].lat), Number(sector[1].lng))
      return p1.distanceTo(p2)
    })
    const distancesInKmRounded = distances.map(distance => Math.round(distance / 1000))

    const totalDistance = distances.reduce((acc, val) => acc + val)

    const p1 = new LatLonEllipsoidal(Number(route[0].lat), Number(route[0].lng))
    const p2 = new LatLonEllipsoidal(
      Number(route[route.length - 1].lat),
      Number(route[route.length - 1].lng)
    )
    const nonStopDistance = p1.distanceTo(p2)

    const difference = ((totalDistance - nonStopDistance) * 100) / nonStopDistance
    const differenceParsed = `${(Math.round(difference * 10) / 10).toFixed(1)}%`
    return (
      <div
        className="route-element"
        style={style}
      >
        <div
          className="sector-elements"
          onClick={() => this.toggleCollapsible()}
          role="button"
          tabIndex={0}
        >
          {sectors.map((sector, i) => (
            <SectorElement sector={sector} distance={distancesInKmRounded[i]} key={uniqueId()} />
          ))}
          {sectors.length > 1 ? (
            <div className="big-font italic padding-4px">
              <span>Total:</span>
              <span className="float-right bold">
                {Math.round(totalDistance / 1000)} km
              </span>
            </div>
          ) : null
        }
        </div>
        <Collapse isOpened={this.state.isOpened}>
          <CollapsibleElement
            route={route}
            distancesInKmRounded={distancesInKmRounded}
            distances={distances}
            sectors={sectors}
            distanceToTimeString={distanceToTimeString}
            nonStopDistance={nonStopDistance}
            totalDistance={totalDistance}
            differenceParsed={differenceParsed}
          />
          {/* <div className="collapsible">
            <div>
              {route.map((airport, i) => (
                <div key={uniqueId()}>
                  <div className="collapsible-airport">
                    <div>{airport.city} ({airport.iata})</div>
                    <div className="collapsible-name">{airport.name}</div>
                  </div>
                  {distancesInKmRounded[i] ? (
                    <div className="collapsible-distance">
                      <i className="fa fa-arrow-down" aria-hidden="true" />
                      <div>
                        <div>Distance</div>
                        <div>{distancesInKmRounded[i]} km</div>
                      </div>
                      <div className="duration">
                        <div>Duration (est)</div>
                        <div>{distanceToTimeString(distances[i])}</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          {sectors.length > 1 ? (
            <div className="total-distance">
              {route[0].iata !== route[route.length - 1].iata ?
                <div>
                  Non-stop {route[0].iata} - {route[route.length - 1].iata}: {Math.round(nonStopDistance / 1000)} km
                </div> :
                null
              }
              <div>
                <span>
                  Total distance: {Math.round(totalDistance / 1000)} km
                  {route[0].iata !== route[route.length - 1].iata ?
                    <span>(+{differenceParsed})</span> :
                    null
                  }
                </span>
              </div>
            </div>
          ) : null} */}
        </Collapse>
      </div>
    )
  }
}

RouteElement.propTypes = {
  route: PropTypes.arrayOf(PropTypes.object).isRequired,
  index: PropTypes.number.isRequired
}

export default RouteElement
