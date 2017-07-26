import React from "react"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
import Tooltip from "rc-tooltip"
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
  isMobile
}) {
  const buttonClass = buttonsVisible ? "map-button" : "map-button invisible"
  return (
    <div id="button-group">
      <Tooltip
        placement="left"
        overlay={"text"}
        arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
      >
        <div>
          <button
            className={buttonClass}
            onClick={!isMobile ? toggleSidebarDock : () => handleSetSidebarOpen(true)}
          >
            {!isSidebarDocked || isMobile ?
              <FaBars /> :
              <FaArrowsAlt />
            }
          </button>
        </div>
      </Tooltip>
      <div id="purge">
        <button data-tip data-for="delete" className={buttonClass} onClick={() => history.push("/")}>
          <FaTrashO />
        </button>
        <ReactTooltip className="tooltip" id="delete" place="right" effect="solid">
          <span>Clear routes</span>
        </ReactTooltip>
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

export default ButtonGroup
