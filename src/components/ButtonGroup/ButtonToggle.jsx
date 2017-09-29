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
          offColor="#161616"
          onColor="#21658a"
          height="22"
          width="48"
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
