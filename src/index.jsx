import React from "react"
import ReactDOM from "react-dom"
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import ReduxThunk from "redux-thunk"
import logger from "redux-logger"

import "./stylesheets/styles.css"
import "./stylesheets/map.css"
import "./stylesheets/route-list.css"
import "./stylesheets/react-select.css"
import "./stylesheets/react-toggle.css"

import reducer from "./reducers"
import App from "./components/App"

const store = createStore(reducer, applyMiddleware(ReduxThunk, logger))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
)
