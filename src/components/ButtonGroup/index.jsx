import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import FaBars from 'react-icons/fa/bars';
import FaArrowsAlt from 'react-icons/fa/arrows-alt';
import FaTrashO from 'react-icons/fa/trash-o';
import Settings from './Settings';
import MapSelection from './MapSelection';
import MapButtonWithTooltip from './MapButtonWithTooltip';

function ButtonGroup({
  isSidebarDocked,
  toggleSidebarDock,
  handleSetSidebarOpen,
  isMobile,
  dispatch
}) {
  return (
    <div id="button-group">
      <div id="left-button-group">
        <MapButtonWithTooltip
          handleClick={!isMobile ? toggleSidebarDock : () => handleSetSidebarOpen(true)}
          tooltipId="menu"
          buttonContent={!isSidebarDocked || isMobile ? <FaBars /> : <FaArrowsAlt />}
          tooltipContent={
            !isSidebarDocked || isMobile ? <span>Show menu</span> : <span>Fullscreen</span>
          }
        />
        <MapButtonWithTooltip
          handleClick={() => dispatch(push('/'))}
          tooltipId="delete"
          buttonContent={<FaTrashO />}
          tooltipContent={<span>Clear routes</span>}
        />
        <Settings />
      </div>
      <MapSelection />
    </div>
  );
}

ButtonGroup.propTypes = {
  isSidebarDocked: PropTypes.bool.isRequired,
  toggleSidebarDock: PropTypes.func.isRequired,
  handleSetSidebarOpen: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    isMobile: state.mobile
  };
};

export default connect(mapStateToProps)(ButtonGroup);
