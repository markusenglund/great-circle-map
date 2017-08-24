import React from "react"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
import { connect } from "react-redux"

function MapButtonWithTooltip({
  buttonClass,
  handleClick,
  tooltipId,
  buttonContent,
  tooltipContent
}) {
  return (
    <div>
      <button
        className={buttonClass}
        onClick={handleClick}
        data-tip
        data-for={tooltipId}
        data-event="mouseenter focusin"
        data-event-off="mouseleave focusout click"
      >
        {buttonContent}
      </button>
      <ReactTooltip
        className="tooltip"
        id={tooltipId}
        place="right"
        effect="solid"
      >
        {tooltipContent}
      </ReactTooltip>
    </div>
  )
}

MapButtonWithTooltip.propTypes = {
  handleClick: PropTypes.func.isRequired,
  tooltipId: PropTypes.string.isRequired,
  buttonContent: PropTypes.element.isRequired,
  tooltipContent: PropTypes.element.isRequired,
  buttonClass: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    buttonClass: state.settings.buttonsVisible ? "map-button" : "map-button invisible"
  }
}

export default connect(mapStateToProps)(MapButtonWithTooltip)
