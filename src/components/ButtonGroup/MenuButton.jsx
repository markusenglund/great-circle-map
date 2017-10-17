import React from 'react';
import PropTypes from 'prop-types';
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';

function MenuButton({
  selectedOption,
  options,
  handleSelection,
  handleMenuToggle,
  readable,
  cssId
}) {
  return (
    <div className="menu-button-group">
      <label htmlFor={cssId}>{readable}</label>
      <Wrapper
        onSelection={val => handleSelection(val)}
        onMenuToggle={state => {
          handleMenuToggle(state.isOpen);
        }}
        className="menu-button"
        id={cssId}
      >
        <Button className="menu-button-trigger">
          <span className="menu-button-trigger-text">{selectedOption.readable}</span>
        </Button>
        <Menu>
          <ul className="menu-button-menu">
            {options.map(obj => (
              <li className="menu-item-wrapper" key={obj.readable}>
                <MenuItem className="menu-item" text={obj.readable} value={obj}>
                  {obj.readable}
                </MenuItem>
              </li>
            ))}
          </ul>
        </Menu>
      </Wrapper>
    </div>
  );
}

MenuButton.propTypes = {
  selectedOption: PropTypes.shape({
    readable: PropTypes.string.isRequired
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  handleSelection: PropTypes.func.isRequired,
  handleMenuToggle: PropTypes.func.isRequired,
  readable: PropTypes.string.isRequired,
  cssId: PropTypes.string.isRequired
};

export default MenuButton;
