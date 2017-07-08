import React from "react"
import PropTypes from "prop-types"
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
      <div>
        <button
          className={buttonClass}
          onClick={!isMobile ? toggleSidebarDock : () => handleSetSidebarOpen(true)}
        >
          {!isSidebarDocked || isMobile ?
            <FaBars /> :// <i className="fa fa-bars" aria-hidden /> :
            <FaArrowsAlt /> // <i className="fa fa-arrows-alt" aria-hidden />
          }
        </button>
      </div>
      <div id="purge"><button className={buttonClass} onClick={() => history.push("/")}>
        <FaTrashO />{/* <i className="fa fa-trash-o" aria-hidden /> */}
      </button></div>
      <Settings buttonClass={buttonClass} />
    </div>
  )
}

ButtonGroup.propTypes = {
  isSidebarDocked: PropTypes.bool.isRequired,
  toggleSidebarDock: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.function }).isRequired,
  buttonsVisible: PropTypes.bool.isRequired
}

export default ButtonGroup
