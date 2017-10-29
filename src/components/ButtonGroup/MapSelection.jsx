import React from 'react';
import { connect } from 'react-redux';
import { push, Fragment } from 'redux-little-router';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

function MapSelection({ dispatch, buttonClass }) {
  function handleChangeToGoogleMap(mapType) {
    dispatch(push({ pathname: mapType }, { persistQuery: true }));
  }

  return (
    <div id="map-selection">
      <Fragment withConditions={({ pathname }) => pathname !== '/globe'}>
        <div>
          <button
            data-tip
            data-for="svg-map-button"
            data-event="mouseenter focusin"
            data-event-off="mouseleave focusout click"
            className={buttonClass}
            id="svg-map-button"
            onClick={() => {
              dispatch(push({ pathname: '/globe' }, { persistQuery: true }));
            }}
          >
            <img src="/earth.png" srcSet="/earth-2x.png 2x" alt="3d-globe" width={60} height={60} />
          </button>
          <ReactTooltip className="tooltip" id="svg-map-button" place="left" effect="solid">
            <span>3D globe</span>
          </ReactTooltip>
        </div>
      </Fragment>
      <Fragment withConditions={({ pathname }) => pathname !== '/'}>
        <div>
          <button
            data-tip
            data-for="satellite-button"
            data-event="mouseenter focusin"
            data-event-off="mouseleave focusout click"
            className={buttonClass}
            id="satellite-button"
            onClick={() => handleChangeToGoogleMap('/')}
          >
            <img src="/satellite.png" alt="satellite" />
          </button>
          <ReactTooltip className="tooltip" id="satellite-button" place="left" effect="solid">
            <span>Satellite</span>
          </ReactTooltip>
        </div>
      </Fragment>
      <Fragment withConditions={({ pathname }) => pathname !== '/roadmap'}>
        <div>
          <button
            data-tip
            data-for="roadmap-button"
            data-event="mouseenter focusin"
            data-event-off="mouseleave focusout click"
            className={buttonClass}
            id="roadmap-button"
            onClick={() => handleChangeToGoogleMap('roadmap')}
          >
            <img src="/roadmap.png" alt="roadmap" />
          </button>
          <ReactTooltip className="tooltip" id="roadmap-button" place="left" effect="solid">
            <span>Roadmap</span>
          </ReactTooltip>
        </div>
      </Fragment>
    </div>
  );
}

MapSelection.propTypes = {
  dispatch: PropTypes.func.isRequired,
  buttonClass: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    buttonClass: state.settings.buttonsVisible
      ? 'map-selection-button'
      : 'map-selection-button invisible'
  };
}

export default connect(mapStateToProps)(MapSelection);
