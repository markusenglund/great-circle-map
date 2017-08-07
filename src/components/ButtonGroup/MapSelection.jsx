import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"


function MapSelection({ dispatch, buttonClass }) {
  return (
    <div id="map-selection">
      <div>
        <button
          data-tip
          data-for="svg-map-button"
          data-event="mouseenter focusin"
          data-event-off="mouseleave focusout click"
          className={buttonClass}
          id="svg-map-button"
          onClick={() => {
            dispatch({ type: "ENABLE_MAP_REBOUND" })
            dispatch({ type: "CHANGE_MAP" })
          }}
        >
          <img src="/earth.png" alt="3d-globe" />
        </button>
        <ReactTooltip
          className="tooltip"
          id="svg-map-button"
          place="left"
          effect="solid"
        >
          <span>3D globe</span>
        </ReactTooltip>
      </div>
      <div>
        <button
          data-tip
          data-for="satellite-button"
          data-event="mouseenter focusin"
          data-event-off="mouseleave focusout click"
          className={buttonClass}
          id="satellite-button"
          onClick={() => {
            dispatch({ type: "ENABLE_MAP_REBOUND" })
            dispatch({ type: "CHANGE_MAP" })
          }}
        >
          <img src="/satellite.png" alt="3d-globe" />
        </button>
        <ReactTooltip
          className="tooltip"
          id="satellite-button"
          place="left"
          effect="solid"
        >
          <span>Satellite</span>
        </ReactTooltip>
      </div>
      <div>
        <button
          data-tip
          data-for="roadmap-button"
          data-event="mouseenter focusin"
          data-event-off="mouseleave focusout click"
          className={buttonClass}
          id="roadmap-button"
          onClick={() => {
            dispatch({ type: "ENABLE_MAP_REBOUND" })
            dispatch({ type: "CHANGE_MAP" })
          }}
        >
          <img src="/roadmap.png" alt="3d-globe" />
        </button>
        <ReactTooltip
          className="tooltip"
          id="roadmap-button"
          place="left"
          effect="solid"
        >
          <span>Roadmap</span>
        </ReactTooltip>
      </div>
    </div>
  )
}

export default connect()(MapSelection)
