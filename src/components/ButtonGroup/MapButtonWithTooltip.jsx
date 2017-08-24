import React from "react"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"

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
  buttonClass: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  tooltipId: PropTypes.string.isRequired,
  buttonContent: PropTypes.element.isRequired,
  tooltipContent: PropTypes.element.isRequired
}

export default MapButtonWithTooltip
