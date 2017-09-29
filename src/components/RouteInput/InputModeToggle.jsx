import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Switch from "react-switch"

class InputModeToggle extends Component {
  constructor() {
    super()
    this.handleModeChange = this.handleModeChange.bind(this)
  }

  handleModeChange(checked) {
    const { dispatch } = this.props
    if (checked) {
      dispatch({ type: "CHANGE_INPUT_MODE", mode: "advanced" })
    } else {
      dispatch({ type: "CHANGE_INPUT_MODE", mode: "search" })
    }
  }

  render() {
    const { inputMode } = this.props

    return (
      <div className="toggle-group">
        <label className="toggle-group-label" htmlFor="input-mode">Raw input</label>
        <Switch
          checked={inputMode === "advanced"}
          onChange={this.handleModeChange}
          id="input-mode"
          offColor="#161616"
          onColor="#21658a"
          height="22"
          width="48"
        />
      </div>
    )
  }
}

InputModeToggle.propTypes = {
  inputMode: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default connect()(InputModeToggle)
