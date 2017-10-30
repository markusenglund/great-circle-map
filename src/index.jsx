import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import { routerForBrowser } from 'redux-little-router';
import createBrowserHistory from 'history/createBrowserHistory';
import ReduxThunk from 'redux-thunk';
// import logger from 'redux-logger';

import './stylesheets/styles.scss';
import './stylesheets/map.scss';

import reducers from './reducers';
import App from './components/App';
import checkIfMobile from './utils/checkIfMobile';

const history = createBrowserHistory();

const initializeAnalytics = () => {
  /* eslint-disable */
  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    (i[r] =
      i[r] ||
      function() {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-104156354-1', 'auto');
  ga('send', 'pageview');
  /* eslint-enable */

  history.listen(location => {
    ga('send', 'pageview', location.pathname);
  });
};

initializeAnalytics();

const routes = {
  '/': {
    mapType: 'satellite'
  },
  '/roadmap': {
    mapType: 'roadmap'
  }
};

const { reducer, middleware, enhancer } = routerForBrowser({
  routes
});

const store = createStore(
  combineReducers({ ...reducers, router: reducer }),
  { isMobile: checkIfMobile() },
  compose(enhancer, applyMiddleware(ReduxThunk, middleware))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
