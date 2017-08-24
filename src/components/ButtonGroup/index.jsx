import React from "react"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"
import FaBars from "react-icons/fa/bars"
import FaArrowsAlt from "react-icons/fa/arrows-alt"
import FaTrashO from "react-icons/fa/trash-o"
import Settings from "./Settings"
import MapSelection from "./MapSelection"
import MapButtonWithTooltip from "./MapButtonWithTooltip"

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
      <div id="left-button-group">
        <MapButtonWithTooltip
          buttonClass={buttonClass}
          handleClick={!isMobile ? toggleSidebarDock : () => handleSetSidebarOpen(true)}
          tooltipId="menu"
          buttonContent={!isSidebarDocked || isMobile ?
            <FaBars /> :
            <FaArrowsAlt />
          }
          tooltipContent={!isSidebarDocked || isMobile ?
            <span>Show menu</span> :
            <span>Fullscreen</span>
          }
        />
        <MapButtonWithTooltip
          buttonClass={buttonClass}
          handleClick={() => history.push("/")}
          tooltipId="delete"
          buttonContent={<FaTrashO />}
          tooltipContent={<span>Clear routes</span>}
        />
        <Settings buttonClass={buttonClass} />
      </div>
      <MapSelection buttonsVisible={buttonsVisible} />
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
