import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'redux-little-router';
import ColorPicker from './ColorPicker';

class RouteColorPicker extends Component {
  constructor() {
    super();
    this.state = { pickerOpen: false };

    this.togglePicker = this.togglePicker.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside() {
    this.setState({ pickerOpen: false });
  }

  togglePicker() {
    this.setState({ pickerOpen: !this.state.pickerOpen });
  }

  handleChange({ hex }) {
    const { dispatch } = this.props;
    dispatch(push({ query: { color: hex } }, { persistQuery: true }));
  }

  render() {
    const { routeColor } = this.props;
    return (
      <div className="color-picker-selection">
        <div>Route color</div>
        <button
          className="color-picker-trigger"
          style={{ backgroundColor: routeColor }}
          onClick={this.togglePicker}
        />
        {this.state.pickerOpen ? (
          <ColorPicker
            color={routeColor}
            handleChange={this.handleChange}
            handleClickOutside={this.handleClickOutside}
          />
        ) : null}
      </div>
    );
  }
}

RouteColorPicker.propTypes = {
  routeColor: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return { routeColor: state.router.query.color || '#d03030' };
}

export default connect(mapStateToProps)(RouteColorPicker);
