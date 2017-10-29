import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import RouteInput from './RouteInput';
import RouteList from './RouteList';
import Footer from './Footer';

function Sidebar({ isMobile }) {
  return (
    <div className="left-column">
      <Header />
      {!isMobile ? <RouteInput /> : null}
      <RouteList />
      <Footer />
    </div>
  );
}

Sidebar.propTypes = { isMobile: PropTypes.bool.isRequired };

export default Sidebar;
