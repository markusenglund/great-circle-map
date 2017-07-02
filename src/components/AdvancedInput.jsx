import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

class AdvancedInput extends Component {
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
    const { history, dispatch } = this.props
    const newUrlParam = encodeURIComponent(this.state.value)
    dispatch({ type: "ENABLE_MAP_REBOUND" })
    history.push(`/${newUrlParam}`)
  }

  handleKeyPress(event) {
    if (event.which === 13 && !event.shiftKey) {
      this.handleSubmit(event)
    }
  }

  render() {
    return (
      <div>
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
          </div>
        </form>
      </div>
    )
  }
}

AdvancedInput.propTypes = {
  urlParam: PropTypes.string,
  history: PropTypes.shape({ push: PropTypes.function }).isRequired,
  dispatch: PropTypes.func.isRequired
}
AdvancedInput.defaultProps = { urlParam: "" }

export default connect()(AdvancedInput)
