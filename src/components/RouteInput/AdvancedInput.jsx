import React, { Component } from "react"
import { connect } from "react-redux"
import { push } from "react-router-redux"
import PropTypes from "prop-types"

class AdvancedInput extends Component {
  constructor(props) {
    super(props)
    this.state = { value: props.urlParam }

    this.handleTextareaMounted = this.handleTextareaMounted.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.urlParam })
  }

  handleTextareaMounted(textarea) {
    if (textarea) {
      this.textarea = textarea
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    const { dispatch, isMobile } = this.props

    if (isMobile) {
      this.textarea.blur()
    }
    // TODO: Fix encodeURIComponent kerfuffle
    const newUrlParam = encodeURIComponent(this.state.value)
    dispatch({ type: "ENABLE_MAP_REBOUND" })
    dispatch(push(newUrlParam))
  }

  handleKeyPress(event) {
    if (event.which === 13 && !event.shiftKey) {
      this.handleSubmit(event)
    }
  }

  render() {
    return (
      <div className="advanced-input">
        <p className="description">
          Manually type in IATA or ICAO airport codes separated
          by dashes and commas to display routes.
        </p>
        <form className="input-form" onSubmit={e => this.handleSubmit(e)}>
          <div id="textarea-wrapper">
            <textarea
              value={this.state.value}
              onChange={e => this.handleChange(e)}
              onKeyPress={e => this.handleKeyPress(e)}
              placeholder="JFK-LHR/OSL, MAD-DXB-HKG, etc."
              type="text"
              id="textarea"
              spellCheck={false}
              ref={this.handleTextareaMounted}
            />
          </div>
          <div className="submit-button-wrapper">
            <button className="btn" type="submit">Go</button>
          </div>
        </form>
      </div>
    )
  }
}

AdvancedInput.propTypes = {
  urlParam: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  return {
    isMobile: state.mobile,
    urlParam: decodeURIComponent(state.router.location.pathname.slice(1))
  }
}

export default connect(mapStateToProps)(AdvancedInput)
