import React from "react"
import PropTypes from "prop-types"

function ErrorMessage({ error }) {
  return (
    <div className="error-message">{error}</div>
  )
}

ErrorMessage.propTypes = {
  error: PropTypes.string.isRequired
}

export default ErrorMessage
