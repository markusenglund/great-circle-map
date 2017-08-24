import "babel-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import ReduxThunk from "redux-thunk"
import logger from "redux-logger"
import { createEpicMiddleware } from "redux-observable"

import "./stylesheets/styles.css"
import "./stylesheets/map.css"
import "./stylesheets/route-list.css"
import "./stylesheets/react-select.css"
import "./stylesheets/react-toggle.css"
import "./stylesheets/svg-map.css"

import reducer from "./reducers"
import rootEpic from "./epics"
import App from "./components/App"

const epicMiddleware = createEpicMiddleware(rootEpic)

const store = createStore(reducer, applyMiddleware(ReduxThunk, epicMiddleware, logger))

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route exact path="/:string?" component={App} />
    </Router>
  </Provider>,
  document.getElementById("app")
)
