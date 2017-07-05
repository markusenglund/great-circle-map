import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Toggle from "react-toggle"

class ButtonToggle extends Component {
  handleModeChange(checked) {
    const { dispatch } = this.props
    dispatch({ type: "TOGGLE_BUTTON_VISIBILITY", visible: checked })
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.handleModeChange(!event.target.checked)
    }
  }

  render() {
    const { buttonsVisible } = this.props

    return (
      <div className="toggle">
        <div>Show buttons</div>
        <Toggle
          checked={buttonsVisible}
          icons={false}
          onChange={e => this.handleModeChange(e.target.checked)}
          id="button-toggle"
          onKeyDown={e => this.handleKeyDown(e)}
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
