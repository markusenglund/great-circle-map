import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import ErrorMessage from "./ErrorMessage"
import InputModeToggle from "./InputModeToggle"
import AdvancedInput from "./AdvancedInput"
import SearchInput from "./SearchInput"


class RouteInput extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = { value: props.urlParam }
  // }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({ value: nextProps.urlParam })
  // }
  //
  // handleChange(event) {
  //   this.setState({ value: event.target.value })
  // }
  //
  // handleSubmit(event) {
  //   event.preventDefault()
  //   const { history } = this.props
  //   const newUrlParam = encodeURIComponent(this.state.value)
  //   history.push(`/${newUrlParam}`)
  // }
  //
  // handleKeyPress(event) {
  //   if (event.which === 13 && !event.shiftKey) {
  //     this.handleSubmit(event)
  //   }
  // }

  render() {
    const { error, inputMode, history, urlParam, airportData } = this.props
    return (
      <div>
        <div>Route input</div>
        <InputModeToggle inputMode={inputMode} />
        { inputMode === "search" ?
          <SearchInput history={history} urlParam={urlParam} /> :
          <AdvancedInput history={history} urlParam={urlParam} />
        }
        {error ? <ErrorMessage error={error} /> : null}
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
    inputMode: state.inputMode,
    airportData: state.airportData
  }
}

export default connect(mapStateToProps)(RouteInput)
