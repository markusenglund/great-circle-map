import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Toggle from "react-toggle"
// import { changeInputMode } from "../actionCreators"

class InputModeToggle extends Component {
  handleModeChange() {
    const { inputMode, dispatch } = this.props
    if (inputMode === "search") {
      dispatch({ type: "CHANGE_INPUT_MODE", mode: "advanced" })
    } else if (inputMode === "advanced") {
      dispatch({ type: "CHANGE_INPUT_MODE", mode: "search" })
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.handleModeChange()
    }
  }

  render() {
    const { inputMode } = this.props

    return (
      <div className="toggle-group">
        <div className="toggle-group-label">Raw input</div>
        <Toggle
          checked={inputMode === "advanced"}
          icons={{
            unchecked: null
          }}
          onChange={() => this.handleModeChange()}
          id="input-mode"
          onKeyDown={e => this.handleKeyDown(e)}
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
