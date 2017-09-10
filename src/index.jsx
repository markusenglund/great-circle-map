import "babel-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import ReduxThunk from "redux-thunk"
import logger from "redux-logger"
import Perf from "react-addons-perf"

import "./stylesheets/styles.scss"
import "./stylesheets/map.scss"
import "./stylesheets/react-toggle.scss"

import reducer from "./reducers"
import App from "./components/App"

window.Perf = Perf


const store = createStore(reducer, applyMiddleware(ReduxThunk, logger))

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route exact path="/:string?" component={App} />
    </Router>
  </Provider>,
  document.getElementById("app")
)
