import React from 'react';
import { Link } from 'redux-little-router';

const Header = () => {
  return (
    <Link className="header-link" href="/">
      <div id="header">
        <img src="/logo.svg" alt="logo" width={60} />
        <span>Great Circle Map</span>
      </div>
    </Link>
  );
};

export default Header;
