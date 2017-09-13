import "babel-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import { Router, Route } from "react-router-dom"
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import ReduxThunk from "redux-thunk"
import createBrowserHistory from "history/createBrowserHistory"
// import logger from "redux-logger"
/* eslint-disable */
// import Perf from "react-addons-perf"
/* eslint-enable */

import "./stylesheets/styles.scss"
import "./stylesheets/map.scss"
import "./stylesheets/react-toggle.scss"

import reducer from "./reducers"
import App from "./components/App"

// Remove in production
// window.Perf = Perf

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

const store = createStore(reducer, applyMiddleware(ReduxThunk))

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route exact path="/:string?" component={App} />
    </Router>
  </Provider>,
  document.getElementById("app")
)
