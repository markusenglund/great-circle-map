import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './route-list.scss';
import RouteElement from './RouteElement';
import Footer from '../Footer';
import { getRoutes } from '../../selectors';

class RouteList extends Component {
  shouldComponentUpdate({ routes }) {
    return routes !== null;
  }

  render() {
    const { routes, isMobile } = this.props;
    return (
      <div id="route-list-wrapper">
        {isMobile && routes.length === 0 ? (
          <div className="empty-message">Enter at least one route to see more information.</div>
        ) : (
          <ul id="route-list">
            {routes.map((route, i) => {
              return route.length > 1 ? (
                <RouteElement key={route.id} route={route} index={i} />
              ) : null;
            })}
          </ul>
        )}
        <Footer />
      </div>
    );
  }
}

RouteList.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.array),
  isMobile: PropTypes.bool.isRequired
};
RouteList.defaultProps = { routes: null };
function mapStateToProps(state) {
  const { routes } = getRoutes(state);
  return {
    routes,
    isMobile: state.isMobile
  };
}

export default connect(mapStateToProps)(RouteList);
