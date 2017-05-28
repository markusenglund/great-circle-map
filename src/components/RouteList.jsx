import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import RouteElement from "./RouteElement"

function RouteList({ routes }) {
  let id = 0
  return (
    <div id="route-list">
      {routes.map(route => <RouteElement key={(id += 1)} route={route} />)}
    </div>
  )
}


RouteList.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.array).isRequired
}

function mapStateToProps(state) {
  return {
    routes: state.routes
  }
}

export default connect(mapStateToProps)(RouteList)
