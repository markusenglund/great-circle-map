import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import * as actionCreators from "../actionCreators"
import ReactGoogleMaps from "./ReactGoogleMaps"

class Home extends Component {
  render() {
    const { counter, numCounters, increment, add } = this.props
    const counters = []
    for (let i = 0; i < numCounters; i += 1) {
      counters.push(<h1 key={i}>{counter}</h1>)
    }
    return (
      <div>
        <h1>
          Home
        </h1>
        <div>
          {counters}
          <button onClick={increment}>Increment</button>
          <button onClick={add}>Add</button>
          <ReactGoogleMaps />
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  counter: PropTypes.number.isRequired,
  numCounters: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    counter: state.counter,
    numCounters: state.numCounters
  }
}
const mapDispatchToProps = (dispatch) => {
  const { increment, add } = actionCreators
  return bindActionCreators({ increment, add }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
