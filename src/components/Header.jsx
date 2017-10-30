import React from 'react';
import { Link } from 'redux-little-router';

const Header = () => {
  return (
    <Link href="/">
      <div id="header">
        <img src="/logo.svg" alt="logo" width={60} />
        <h1>Great Circle Map</h1>
      </div>
    </Link>
  );
};

export default Header;
