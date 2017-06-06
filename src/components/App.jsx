import React, { Component } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Main from "./Main"

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/:string?" component={Main} />
      </Router>
    )
  }
}

export default App
