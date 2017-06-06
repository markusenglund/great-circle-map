import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import uniqueId from "lodash.uniqueid"
import RouteElement from "./RouteElement"

function RouteList({ routes }) {
  if (routes.length) {
    return (
      <div id="route-list">
        {routes.map((route, i) => {
          return route.length > 1 ? <RouteElement key={uniqueId()} route={route} index={i} /> : null
        })}
      </div>
    )
  }
  return null
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
