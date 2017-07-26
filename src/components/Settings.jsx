import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
import CloseOnEscape from "react-close-on-escape"
import onClickOutside from "react-onclickoutside"
import FaCog from "react-icons/fa/cog"
import MenuButton from "./MenuButton"
import ButtonToggle from "./ButtonToggle"

class Settings extends Component {
  constructor() {
    super()
    this.state = { isVisible: false, isAnyOpen: false }

    this.handleMenuToggle = this.handleMenuToggle.bind(this)
    this.handleEscape = this.handleEscape.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.handleMapTypeSelection = this.handleMapTypeSelection.bind(this)
    this.handleDistanceSelection = this.handleDistanceSelection.bind(this)
    this.handleLabelSelection = this.handleLabelSelection.bind(this)
  }

  handleMenuToggle(isOpen) {
    // Wait to change state, so that handleEscape gets the old/correct isAnyOpen value
    setTimeout(() => {
      this.setState({ isAnyOpen: isOpen })
    }, 1)
  }

  handleEscape() {
    if (!this.state.isAnyOpen) {
      this.setState({ isVisible: false })
    }
  }

  handleClickOutside() {
    this.setState({ isVisible: false })
  }

  handleMapTypeSelection(value) {
    const { dispatch } = this.props
    dispatch({ type: "DISABLE_MAP_REBOUND" })
    dispatch({ type: "CHANGE_MAP_TYPE", mapType: value })
  }

  handleDistanceSelection(value) {
    const { dispatch } = this.props
    dispatch({ type: "CHANGE_DISTANCE_UNIT", distanceUnit: value })
  }

  handleLabelSelection(value) {
    const { dispatch } = this.props
    dispatch({ type: "DISABLE_MAP_REBOUND" })
    dispatch({ type: "CHANGE_LABEL", label: value })
  }

  render() {
    const { mapType, distanceUnit, label, buttonClass } = this.props
    const mapTypes = [
      { type: "satellite", readable: "Satellite" },
      { type: "roadmap", readable: "Roadmap" },
      { type: "hybrid", readable: "Hybrid" }]

    const distanceUnits = [
      { abbr: "km", readable: "Kilometers" },
      { abbr: "mi", readable: "Statute miles" },
      { abbr: "nm", readable: "Nautical miles" }
    ]

    const labels = [
      { value: "iata", readable: "IATA code" },
      { value: "icao", readable: "ICAO code" },
      { value: "city", readable: "City name" },
      { value: "none", readable: "None" }
    ]

    return (
      <div id="settings">
        <button
          className={buttonClass}
          onClick={() => this.setState({ isVisible: !this.state.isVisible })}
          data-tip
          data-for="settings"
        >
          <FaCog />
        </button>

        <ReactTooltip className="tooltip" id="settings" place="right" effect="solid">
          <span>Settings</span>
        </ReactTooltip>

        {this.state.isVisible ? (
          <CloseOnEscape onEscape={this.handleEscape}>
            <div id="dropdown">
              <MenuButton
                selectedOption={mapType}
                options={mapTypes}
                handleSelection={this.handleMapTypeSelection}
                handleMenuToggle={this.handleMenuToggle}
                readable="Map type"
                cssId="map-type"
              />
              <MenuButton
                selectedOption={distanceUnit}
                options={distanceUnits}
                handleSelection={this.handleDistanceSelection}
                handleMenuToggle={this.handleMenuToggle}
                readable="Distance unit"
                cssId="distance-unit"
              />
              <MenuButton
                selectedOption={label}
                options={labels}
                handleSelection={this.handleLabelSelection}
                handleMenuToggle={this.handleMenuToggle}
                readable="Label"
                cssId="label"
              />
              <ButtonToggle />
            </div>
          </CloseOnEscape>
        ) : null}
      </div>
    )
  }
}

Settings.propTypes = {
  mapType: PropTypes.shape({
    type: PropTypes.string.isRequired,
    readable: PropTypes.string.isRequired
  }).isRequired,
  distanceUnit: PropTypes.shape({
    abbr: PropTypes.string.isRequired,
    readable: PropTypes.string.isRequired
  }).isRequired,
  label: PropTypes.shape({
    value: PropTypes.string.isRequired,
    readable: PropTypes.string.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { mapType, distanceUnit, label } = state.settings
  return { mapType, distanceUnit, label } // Lol this can be shortened
}

export default connect(mapStateToProps)(onClickOutside(Settings))
