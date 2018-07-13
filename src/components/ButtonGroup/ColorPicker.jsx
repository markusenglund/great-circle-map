import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

const colors = [
  '#D03030',
  '#B80000',
  '#DB3E00',
  '#FCCB00',
  '#008B02',
  '#12DEDE',
  '#004DCF',
  '#5300EB',
  '#EB9694',
  '#FAD0C3',
  '#FEF3BD',
  '#F1D175',
  '#8EFAAC',
  '#A4BED6',
  '#8EA3F3',
  '#111111'
];

class ColorPicker extends Component {
  handleClickOutside() {
    const { handleClickOutside } = this.props;
    handleClickOutside();
  }

  render() {
    const { color, handleChange } = this.props;
    return (
      <div className="color-picker">
        {colors.map(color => (
          <button
            key={color}
            style={{ background: color }}
            className="color-picker-color"
            onClick={() => handleChange({ hex: color })}
          />
        ))}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleClickOutside: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired
};

export default onClickOutside(ColorPicker);
