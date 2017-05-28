import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { handleRoutes } from "../actionCreators"
import ErrorMessage from "./ErrorMessage"


class RouteInput extends Component {
  constructor() {
    super()
    this.state = { value: "" }
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    const { dispatch } = this.props
    dispatch(handleRoutes(this.state.value))
  }

  handleKeyPress(event) {
    if (event.which === 13 && !event.shiftKey) {
      this.handleSubmit(event)
    }
  }

  // FIXME: Textarea doesn't submit on enter, and has erratic behaviour
  render() {
    const { error } = this.props
    return (
      <form className="input-form" onSubmit={e => this.handleSubmit(e)}>
        <textarea
          value={this.state.value}
          onChange={e => this.handleChange(e)}
          onKeyPress={e => this.handleKeyPress(e)}
          placeholder="JFK-LHR/OSL, AMS-MAD-EZE"
          type="text"
          className="input-textarea"
          required
        />
        <div className="submit-button-wrapper">
          <button className="btn" type="submit">Map</button>
          {error ? <ErrorMessage error={error} /> : null}
        </div>
      </form>
    )
  }
}

RouteInput.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired
}

function mapStateToProps(state) {
  return {
    error: state.error
  }
}

export default connect(mapStateToProps)(RouteInput)
