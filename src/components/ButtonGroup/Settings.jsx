import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-little-router';
import PropTypes from 'prop-types';
import CloseOnEscape from 'react-close-on-escape';
import onClickOutside from 'react-onclickoutside';
import FaCog from 'react-icons/fa/cog';
import MenuButton from './MenuButton';
import ButtonToggle from './ButtonToggle';
import RouteColorPicker from './RouteColorPicker';
import MapButtonWithTooltip from './MapButtonWithTooltip';

class Settings extends Component {
  constructor() {
    super();
    this.state = { isVisible: false, isAnyOpen: false };

    this.handleMenuToggle = this.handleMenuToggle.bind(this);
    this.handleEscape = this.handleEscape.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleDistanceSelection = this.handleDistanceSelection.bind(this);
    this.handleLabelSelection = this.handleLabelSelection.bind(this);
  }

  handleMenuToggle(isOpen) {
    // Wait to change state, so that handleEscape gets the old/correct isAnyOpen value
    setTimeout(() => {
      this.setState({ isAnyOpen: isOpen });
    }, 1);
  }

  handleEscape() {
    if (!this.state.isAnyOpen) {
      this.setState({ isVisible: false });
    }
  }

  handleClickOutside() {
    this.setState({ isVisible: false });
  }

  handleDistanceSelection(unit) {
    const { dispatch } = this.props;
    dispatch(push({ query: { unit } }, { persistQuery: true }));
  }

  handleLabelSelection(label) {
    const { dispatch } = this.props;
    dispatch({ type: 'DISABLE_MAP_REBOUND' });
    dispatch(push({ query: { label } }, { persistQuery: true }));
  }

  render() {
    const { distanceUnitAbbr, labelAbbr } = this.props;

    const distanceUnits = [
      { abbr: 'km', readable: 'Kilometers' },
      { abbr: 'mi', readable: 'Statute miles' },
      { abbr: 'nm', readable: 'Nautical miles' }
    ];
    const selectedUnit = distanceUnits.find(unit => unit.abbr === distanceUnitAbbr);

    const labels = [
      { abbr: 'city', readable: 'City name' },
      { abbr: 'iata', readable: 'IATA code' },
      { abbr: 'icao', readable: 'ICAO code' },
      { abbr: 'none', readable: 'None' }
    ];
    const selectedLabel = labels.find(label => label.abbr === labelAbbr);
    console.log('selected label', selectedLabel, 'label, vale', labelAbbr);
    return (
      <div id="settings">
        <MapButtonWithTooltip
          handleClick={() => this.setState({ isVisible: !this.state.isVisible })}
          tooltipId="settings"
          buttonContent={<FaCog />}
          tooltipContent={<span>Settings</span>}
        />
        {this.state.isVisible ? (
          <CloseOnEscape onEscape={this.handleEscape}>
            <div id="dropdown">
              <MenuButton
                selectedOption={selectedUnit}
                options={distanceUnits}
                handleSelection={this.handleDistanceSelection}
                handleMenuToggle={this.handleMenuToggle}
                readable="Distance unit"
                cssId="distance-unit"
              />
              <MenuButton
                selectedOption={selectedLabel}
                options={labels}
                handleSelection={this.handleLabelSelection}
                handleMenuToggle={this.handleMenuToggle}
                readable="Label"
                cssId="label"
              />
              <ButtonToggle />
              <RouteColorPicker />
            </div>
          </CloseOnEscape>
        ) : null}
      </div>
    );
  }
}

Settings.propTypes = {
  distanceUnitAbbr: PropTypes.string.isRequired,
  labelAbbr: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    distanceUnitAbbr: state.router.query.unit || 'km',
    labelAbbr: state.router.query.label || 'city'
  };
}

export default connect(mapStateToProps)(onClickOutside(Settings));
