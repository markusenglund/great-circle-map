import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { handleRoutes } from "../actionCreators"
import Map from "./Map"
import RouteInput from "./RouteInput"
import RouteList from "./RouteList"

class Main extends Component {
  componentWillReceiveProps(nextProps) {
    // When we receive new props (meaning route parameters) we dispatch route handling action
    if (nextProps.match.params.string !== this.props.match.params.string) {
      const decodedUrlParam = nextProps.match.params.string ? decodeURIComponent(nextProps.match.params.string) : ""
      this.props.dispatch(handleRoutes(decodedUrlParam))
    }
  }

  render() {
    const { match, history } = this.props
    const decodedUrlParam = match.params.string ? decodeURIComponent(match.params.string) : ""
    return (
      <div id="main">
        <div className="left-column">
          <RouteInput urlParam={decodedUrlParam} history={history} />
          <RouteList />
        </div>
        <Map urlParam={decodedUrlParam} />
      </div>
    )
  }
}

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({ params: PropTypes.object }).isRequired,
  history: PropTypes.shape({ push: PropTypes.function }).isRequired
}

export default connect()(Main)
