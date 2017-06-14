import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { changeInputMode } from "../actionCreators"

class InputModeToggle extends Component {
  handleModeChange(event) {
    const { dispatch } = this.props
    dispatch(changeInputMode(event.target.value))
  }

  render() {
    const { inputMode } = this.props

    return (
      <div className="toggle-btn-group">
        <input
          type="radio"
          id="search"
          name="mode"
          value="search"
          className="accessAid"
          onChange={e => this.handleModeChange(e)}
          checked={inputMode === "search"}
        />
        <label htmlFor="search">Search</label>
        <input
          type="radio"
          id="advanced"
          name="mode"
          value="advanced"
          className="accessAid"
          onChange={e => this.handleModeChange(e)}
          checked={inputMode === "advanced"}
        />
        <label htmlFor="advanced">Advanced</label>
      </div>
    )
  }
}

InputModeToggle.propTypes = {
  inputMode: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default connect()(InputModeToggle)
