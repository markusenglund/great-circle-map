import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import InputModeToggle from "./InputModeToggle"
import AdvancedInput from "./AdvancedInput"
import SearchInput from "./SearchInput"


class RouteInput extends Component {
  render() {
    const { inputMode } = this.props
    return (
      <div>
        { inputMode === "search" ?
          <SearchInput /> :
          <AdvancedInput />
        }
        <InputModeToggle inputMode={inputMode} />
      </div>
    )
  }
}

RouteInput.propTypes = {
  inputMode: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    inputMode: state.inputMode
  }
}

export default connect(mapStateToProps)(RouteInput)
