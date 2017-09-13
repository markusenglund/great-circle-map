import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import InputModeToggle from "./InputModeToggle"
import AdvancedInput from "./AdvancedInput"
import SearchInput from "./SearchInput"
import ErrorMessage from "./ErrorMessage"

function RouteInput({ inputMode }) {
  return (
    <div>
      { inputMode === "search" ?
        <SearchInput /> :
        <AdvancedInput />
      }
      <InputModeToggle inputMode={inputMode} />
      <ErrorMessage />
    </div>
  )
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
