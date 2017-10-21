import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './route-list.scss';
import RouteElement from './RouteElement';
import { getRoutes } from '../../selectors';

class RouteList extends Component {
  shouldComponentUpdate({ routes }) {
    return routes !== null;
  }

  render() {
    const { routes } = this.props;
    return (
      <div id="route-list-wrapper">
        <ul id="route-list">
          {routes.map((route, i) => {
            return route.length > 1 ? (
              <RouteElement key={route.id} route={route} index={i} />
            ) : null;
          })}
        </ul>
        <footer id="footer">
          <a href="mailto:markus.s.englund@gmail.com">Contact</a>
          <a
            href="https://github.com/yogaboll/great-circle-map"
            target="_blank"
            rel="noreferrer noopener"
          >
            Code
          </a>
          <span>© 2017 Markus Englund</span>
        </footer>
      </div>
    );
  }
}

RouteList.propTypes = { routes: PropTypes.arrayOf(PropTypes.array) };
RouteList.defaultProps = { routes: null };
function mapStateToProps(state) {
  const { routes } = getRoutes(state);
  return {
    routes
  };
}

export default connect(mapStateToProps)(RouteList);
