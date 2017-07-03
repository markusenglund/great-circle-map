import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

function ErrorMessage({ error }) {
  return (
    <div className="error-message">{error}</div>
  )
}

ErrorMessage.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
}

function mapStateToProps(state) {
  return { error: state.error }
}

export default connect(mapStateToProps)(ErrorMessage)
