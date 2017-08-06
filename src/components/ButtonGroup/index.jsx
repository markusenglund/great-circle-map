import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
import FaBars from "react-icons/fa/bars"
import FaArrowsAlt from "react-icons/fa/arrows-alt"
import FaTrashO from "react-icons/fa/trash-o"
import Settings from "./Settings"


function ButtonGroup({
  isSidebarDocked,
  toggleSidebarDock,
  history,
  buttonsVisible,
  handleSetSidebarOpen,
  isMobile,
  dispatch
}) {
  const buttonClass = buttonsVisible ? "map-button" : "map-button invisible"
  return (
    <div id="button-group">
      <div>
        <button
          className={buttonClass}
          onClick={!isMobile ? toggleSidebarDock : () => handleSetSidebarOpen(true)}
          data-tip
          data-for="menu"
          data-event="mouseenter focusin"
          data-event-off="mouseleave focusout click"
        >
          {!isSidebarDocked || isMobile ?
            <FaBars /> :
            <FaArrowsAlt />
          }
        </button>
        <ReactTooltip
          className="tooltip"
          id="menu"
          place="right"
          effect="solid"
        >
          <span>{!isSidebarDocked || isMobile ? "Show menu" : "Fullscreen"}</span>
        </ReactTooltip>
      </div>
      <div id="purge">
        <button
          data-tip
          data-for="delete"
          className={buttonClass}
          onClick={() => history.push("/")}
          data-event="mouseenter focusin"
          data-event-off="mouseleave focusout click"
        >
          <FaTrashO />
        </button>
        <ReactTooltip className="tooltip" id="delete" place="right" effect="solid">
          <span>Clear routes</span>
        </ReactTooltip>
      </div>
      <div>
        <button
          data-tip
          data-for="switch-map"
          data-event="mouseenter focusin"
          data-event-off="mouseleave focusout click"
          className={buttonClass}
          id="globe-3d"
          onClick={() => {
            dispatch({ type: "ENABLE_MAP_REBOUND" })
            dispatch({ type: "CHANGE_MAP" })
          }}
        >
          <img src="/earth.png" alt="3d-globe" />
        </button>
      </div>
      <Settings buttonClass={buttonClass} />
    </div>
  )
}

ButtonGroup.propTypes = {
  isSidebarDocked: PropTypes.bool.isRequired,
  toggleSidebarDock: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.function }).isRequired,
  buttonsVisible: PropTypes.bool.isRequired,
  handleSetSidebarOpen: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired
}

export default connect()(ButtonGroup)
