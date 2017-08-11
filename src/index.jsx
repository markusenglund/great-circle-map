import "babel-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import ReduxThunk from "redux-thunk"
// import logger from "redux-logger"

import "./stylesheets/styles.css"
import "./stylesheets/map.css"
import "./stylesheets/route-list.css"
import "./stylesheets/react-select.css"
import "./stylesheets/react-toggle.css"
import "./stylesheets/svg-map.css"

import reducer from "./reducers"
import App from "./components/App"

const store = createStore(reducer, applyMiddleware(ReduxThunk))

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route exact path="/:string?" component={App} />
    </Router>
  </Provider>,
  document.getElementById("app")
)
