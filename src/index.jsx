import React from "react"
import ReactDOM from "react-dom"
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import ReduxThunk from "redux-thunk"
import logger from "redux-logger"

import "./styles.css"

import reducer from "./reducers"
// import { fetchProtected } from "./actionCreators"
import App from "./components/App"

const store = createStore(reducer, applyMiddleware(ReduxThunk, logger))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
)
