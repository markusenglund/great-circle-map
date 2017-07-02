import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

function ZoomButtons({ map, dispatch, buttonsVisible }) {
  const buttonClass = buttonsVisible ? "map-button" : "map-button invisible"
  return (
    <div id="zoom-buttons">
      <div><button onClick={() => dispatch({ type: "ZOOM", level: map.getZoom() + 1 })} className={buttonClass}>
        <i className="fa fa-plus" aria-hidden />
      </button></div>
      <div><button onClick={() => dispatch({ type: "ZOOM", level: map.getZoom() - 1 })} className={buttonClass}>
        <i className="fa fa-minus" aria-hidden />
      </button></div>
    </div>
  )
}
ZoomButtons.propTypes = {
  map: PropTypes.shape({ fitBounds: PropTypes.func }),
  dispatch: PropTypes.func.isRequired
}

ZoomButtons.defaultProps = {
  map: null
}

export default connect()(ZoomButtons)
