import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Sidebar from "react-sidebar"
import { handleRoutes } from "../actionCreators"
import Map from "./Map"
import RouteInput from "./RouteInput"
import RouteList from "./RouteList"
import ButtonGroup from "./ButtonGroup"
import ZoomButtons from "./ZoomButtons"

class Main extends Component {
  constructor() {
    super()
    this.state = { isSidebarDocked: true, transitionsActive: false }

    this.toggleSidebarDock = this.toggleSidebarDock.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    // When we receive new props (meaning route parameters) we dispatch route handling action
    if (nextProps.match.params.string !== this.props.match.params.string) {
      const decodedUrlParam = nextProps.match.params.string ? decodeURIComponent(nextProps.match.params.string) : ""
      this.props.dispatch(handleRoutes(decodedUrlParam))
    }
  }

  toggleSidebarDock() {
    this.setState({ transitionsActive: true })
    this.setState({ isSidebarDocked: !this.state.isSidebarDocked })

    // Resize map to workaround the empty map bug
    // FIXME: Could this settimeout cause bugs if transitions take longer?
    const { map } = this.props
    setTimeout(() =>
      google.maps.event.trigger(map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, "resize"),
      300
    )
  }

  render() {
    const { match, history, map, buttonsVisible } = this.props
    const decodedUrlParam = match.params.string ? decodeURIComponent(match.params.string) : ""

    const sidebarContent = (
      <div className="left-column">
        <RouteInput urlParam={decodedUrlParam} history={history} />
        <RouteList urlParam={decodedUrlParam} history={history} />
      </div>
    )

    return (
      <Sidebar
        sidebar={sidebarContent}
        docked={this.state.isSidebarDocked}
        transitions={this.state.transitionsActive}
        styles={{
          content: { overflowY: "auto" }
        }}
      >
        <div id="main">
          <div id="map-wrapper">
            <ButtonGroup
              isSidebarDocked={this.state.isSidebarDocked}
              toggleSidebarDock={this.toggleSidebarDock}
              history={history}
              buttonsVisible={buttonsVisible}
            />
            <ZoomButtons map={map} buttonsVisible={buttonsVisible} />
            <Map urlParam={decodedUrlParam} />
          </div>
        </div>
      </Sidebar>
    )
  }
}

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({ params: PropTypes.object }).isRequired,
  history: PropTypes.shape({ push: PropTypes.function }).isRequired,
  map: PropTypes.shape({ fitBounds: PropTypes.func }),
  buttonsVisible: PropTypes.bool.isRequired
}
Main.defaultProps = {
  map: null
}

function mapStateToProps(state) {
  return { map: state.map.map, buttonsVisible: state.settings.buttonsVisible }
}

export default connect(mapStateToProps)(Main)
