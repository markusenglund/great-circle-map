import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Switch from "react-switch"

class ButtonToggle extends Component {
  constructor() {
    super()
    this.handleModeChange = this.handleModeChange.bind(this)
  }

  handleModeChange(checked) {
    const { dispatch } = this.props
    dispatch({ type: "TOGGLE_BUTTON_VISIBILITY", visible: checked })
  }

  render() {
    const { buttonsVisible } = this.props

    return (
      <div className="toggle">
        <label htmlFor="button-toggle">Show buttons</label>
        <Switch
          checked={buttonsVisible}
          onChange={this.handleModeChange}
          id="button-toggle"
          offColor="#424242"
          onColor="#08205a"
          onHandleColor="#2693e6"
          handleDiameter={28}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
        />
      </div>
    )
  }
}

ButtonToggle.propTypes = {
  buttonsVisible: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return { buttonsVisible: state.settings.buttonsVisible }
}

export default connect(mapStateToProps)(ButtonToggle)
