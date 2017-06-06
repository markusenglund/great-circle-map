import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import ErrorMessage from "./ErrorMessage"

class RouteInput extends Component {
  constructor(props) {
    super(props)
    this.state = { value: props.urlParam }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.urlParam })
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    const { history } = this.props
    const newUrlParam = encodeURIComponent(this.state.value)
    history.push(`/${newUrlParam}`)
  }

  handleKeyPress(event) {
    if (event.which === 13 && !event.shiftKey) {
      this.handleSubmit(event)
    }
  }

  render() {
    const { error } = this.props
    return (
      <form className="input-form" onSubmit={e => this.handleSubmit(e)}>
        <div id="textarea-wrapper">
          <textarea
            value={this.state.value}
            onChange={e => this.handleChange(e)}
            onKeyPress={e => this.handleKeyPress(e)}
            placeholder="JFK-LHR/OSL, AMS-MAD-EZE, etc."
            type="text"
            id="textarea"
            spellCheck={false}
          />
        </div>
        <div className="submit-button-wrapper">
          <button className="btn" type="submit">Go</button>
          {error ? <ErrorMessage error={error} /> : null}
        </div>
      </form>
    )
  }
}

RouteInput.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  urlParam: PropTypes.string,
  history: PropTypes.shape({ push: PropTypes.function }).isRequired
}
RouteInput.defaultProps = { urlParam: "" }


function mapStateToProps(state) {
  return {
    error: state.error
  }
}

export default connect(mapStateToProps)(RouteInput)
