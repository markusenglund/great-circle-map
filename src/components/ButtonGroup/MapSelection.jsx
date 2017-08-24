import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"


function MapSelection({ dispatch, mapState, buttonClass }) {
  function handleChangeToGoogleMap(mapType) {
    if (mapState === "svg") {
      dispatch({ type: "ENABLE_MAP_REBOUND" })
      dispatch({ type: "CHANGE_MAP", map: "google" })
    } else {
      dispatch({ type: "DISABLE_MAP_REBOUND" })
    }
    dispatch({ type: "CHANGE_MAP_TYPE", mapType })
  }

  return (
    <div id="map-selection">
      {mapState !== "svg" ? (
        <div>
          <button
            data-tip
            data-for="svg-map-button"
            data-event="mouseenter focusin"
            data-event-off="mouseleave focusout click"
            className={buttonClass}
            id="svg-map-button"
            onClick={() => {
              dispatch({ type: "CHANGE_MAP", map: "svg" })
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
        ) : null
      }
      {mapState !== "satellite" ? (
        <div>
          <button
            data-tip
            data-for="satellite-button"
            data-event="mouseenter focusin"
            data-event-off="mouseleave focusout click"
            className={buttonClass}
            id="satellite-button"
            onClick={() => handleChangeToGoogleMap("satellite")}
          >
            <img src="/satellite.png" alt="satellite" />
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
        ) : null
      }
      {mapState !== "roadmap" ? (
        <div>
          <button
            data-tip
            data-for="roadmap-button"
            data-event="mouseenter focusin"
            data-event-off="mouseleave focusout click"
            className={buttonClass}
            id="roadmap-button"
            onClick={() => handleChangeToGoogleMap("roadmap")}
          >
            <img src="/roadmap.png" alt="roadmap" />
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
        ) : null
      }
    </div>
  )
}

function mapStateToProps(state) {
  // mapState is the state that describes which map is shown, has nothing to do with mapStatoToProps
  let mapState
  if (state.settings.map === "svg") {
    mapState = "svg"
  } else if (state.settings.mapType === "satellite") {
    mapState = "satellite"
  } else if (state.settings.mapType === "roadmap") {
    mapState = "roadmap"
  }
  return {
    mapState,
    buttonClass: state.settings.buttonsVisible ? "map-selection-button" : "map-selection-button invisible"
  }
}

export default connect(mapStateToProps)(MapSelection)
