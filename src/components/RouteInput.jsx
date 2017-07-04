import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import InputModeToggle from "./InputModeToggle"
import AdvancedInput from "./AdvancedInput"
import SearchInput from "./SearchInput"


class RouteInput extends Component {
  render() {
    const { inputMode, history, urlParam } = this.props
    return (
      <div>
        { inputMode === "search" ?
          <SearchInput history={history} urlParam={urlParam} /> :
          <AdvancedInput history={history} urlParam={urlParam} />
        }
        <InputModeToggle inputMode={inputMode} />
      </div>
    )
  }
}

RouteInput.propTypes = {
  urlParam: PropTypes.string,
  history: PropTypes.shape({ push: PropTypes.function }).isRequired,
  inputMode: PropTypes.string.isRequired
}
RouteInput.defaultProps = { urlParam: "" }


function mapStateToProps(state) {
  return {
    inputMode: state.inputMode
  }
}

export default connect(mapStateToProps)(RouteInput)
