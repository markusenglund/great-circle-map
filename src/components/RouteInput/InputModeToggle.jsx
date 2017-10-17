import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Switch from 'react-switch';

class InputModeToggle extends Component {
  constructor() {
    super();
    this.handleModeChange = this.handleModeChange.bind(this);
  }

  handleModeChange(checked) {
    const { dispatch } = this.props;
    if (checked) {
      dispatch({ type: 'CHANGE_INPUT_MODE', mode: 'advanced' });
    } else {
      dispatch({ type: 'CHANGE_INPUT_MODE', mode: 'search' });
    }
  }

  render() {
    const { inputMode } = this.props;

    return (
      <div className="toggle-group">
        <label className="toggle-group-label" htmlFor="input-mode">
          Raw input
        </label>
        <Switch
          checked={inputMode === 'advanced'}
          onChange={this.handleModeChange}
          offColor="#424242"
          onColor="#08205a"
          onHandleColor="#2693e6"
          handleDiameter={28}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          id="input-mode"
        />
      </div>
    );
  }
}

InputModeToggle.propTypes = {
  inputMode: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect()(InputModeToggle);
