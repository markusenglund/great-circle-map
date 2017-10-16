import "babel-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import { createStore, applyMiddleware, combineReducers } from "redux"
import { Provider } from "react-redux"
import { Route } from "react-router-dom"
import { ConnectedRouter, routerReducer, routerMiddleware } from "react-router-redux"
import createBrowserHistory from "history/createBrowserHistory"
import ReduxThunk from "redux-thunk"
import logger from "redux-logger"

import "./stylesheets/styles.scss"
import "./stylesheets/map.scss"
import "./stylesheets/react-toggle.scss"

import reducers from "./reducers"
import App from "./components/App"

const history = createBrowserHistory()

const initializeAnalytics = () => {
  /* eslint-disable */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-104156354-1', 'auto');
  ga('send', 'pageview');
  /* eslint-enable */

  history.listen((location) => {
    ga("send", "pageview", location.pathname)
  })
}

initializeAnalytics()

const middleware = routerMiddleware(history)

const store = createStore(
  combineReducers({ ...reducers, router: routerReducer }), // Shouldn't work
  applyMiddleware(ReduxThunk, middleware, logger)
)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route exact path="/:string?" component={App} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("app")
)
