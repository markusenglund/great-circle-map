import React from "react"
import PropTypes from "prop-types"
import Settings from "./Settings"

function ButtonGroup({ isSidebarDocked, toggleSidebarDock, history, buttonsVisible }) {
  const buttonClass = buttonsVisible ? "map-button" : "map-button invisible"
  return (
    <div id="button-group">
      <div><button className={buttonClass} onClick={toggleSidebarDock}>
        {isSidebarDocked ?
          <i className="fa fa-arrows-alt" aria-hidden /> :
          <i className="fa fa-bars" aria-hidden />
        }
      </button></div>
      <div id="purge"><button className={buttonClass} onClick={() => history.push("/")}>
        <i className="fa fa-trash-o" aria-hidden />
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
