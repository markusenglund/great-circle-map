import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import ErrorMessage from "./ErrorMessage"
import InputModeToggle from "./InputModeToggle"
import AdvancedInput from "./AdvancedInput"
import SearchInput from "./SearchInput"


class RouteInput extends Component {
  render() {
    const { error, inputMode, history, urlParam } = this.props
    return (
      <div>
        <InputModeToggle inputMode={inputMode} />
        { inputMode === "search" ?
          <SearchInput history={history} urlParam={urlParam} /> :
          <AdvancedInput history={history} urlParam={urlParam} />
        }
        {/* {error ? <ErrorMessage error={error} /> : null} */}
      </div>
    )
  }
}

RouteInput.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  urlParam: PropTypes.string,
  history: PropTypes.shape({ push: PropTypes.function }).isRequired,
  inputMode: PropTypes.string.isRequired
}
RouteInput.defaultProps = { urlParam: "" }


function mapStateToProps(state) {
  return {
    error: state.error,
    inputMode: state.inputMode
  }
}

export default connect(mapStateToProps)(RouteInput)
