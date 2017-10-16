import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import ReactSidebar from "react-sidebar"

import { getRoutesFromUrl, getAirportData, getSvgMap } from "../actionCreators"
import Sidebar from "./Sidebar"
import GoogleMapWrapper from "./GoogleMapWrapper"
import ButtonGroup from "./ButtonGroup"
import SvgMap from "./SvgMap"
import SearchInput from "./RouteInput/SearchInput"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { isSidebarDocked: true, isSidebarOpen: false, transitionsActive: false }

    const { dispatch } = props
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      dispatch({ type: "IS_MOBILE" })
    }

    dispatch(getAirportData())
    dispatch(getSvgMap())

    this.toggleSidebarDock = this.toggleSidebarDock.bind(this)
    this.handleSetSidebarOpen = this.handleSetSidebarOpen.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // When we receive new props (meaning route parameters) we dispatch getRoutesFromUrl action
    const { match, dispatch } = this.props
    if (nextProps.match.params.string !== match.params.string) {
      dispatch(getRoutesFromUrl())
    }
  }

  toggleSidebarDock() {
    this.setState({ transitionsActive: true })
    this.setState({ isSidebarDocked: !this.state.isSidebarDocked })

    // Resize map to workaround the empty map bug, 300 is animation delay
    const { map } = this.props
    setTimeout(
      () => google.maps.event.trigger(map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, "resize"),
      300
    )
  }

  handleSetSidebarOpen(open) {
    this.setState({ transitionsActive: true })
    this.setState({ isSidebarOpen: open })
  }

  render() {
    const { isMobile, googleOrSvg } = this.props

    return (
      <ReactSidebar
        sidebar={<Sidebar isMobile={isMobile} />}
        docked={!isMobile ? this.state.isSidebarDocked : false}
        open={isMobile ? this.state.isSidebarOpen : false}
        onSetOpen={this.handleSetSidebarOpen}
        transitions={this.state.transitionsActive}
        styles={{
          content: { overflowY: "auto" },
          sidebar: { zIndex: 99 }
        }}
      >
        <div id="main">
          {isMobile ? <SearchInput /> : null}
          <div id="map-wrapper">
            <ButtonGroup
              isSidebarDocked={this.state.isSidebarDocked}
              toggleSidebarDock={this.toggleSidebarDock}
              handleSetSidebarOpen={this.handleSetSidebarOpen}
            />
            {googleOrSvg === "google" ?
              <GoogleMapWrapper /> :
              <SvgMap />
            }
          </div>
        </div>
      </ReactSidebar>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({ params: PropTypes.object }).isRequired,
  map: PropTypes.shape({ fitBounds: PropTypes.func }),
  isMobile: PropTypes.bool.isRequired,
  googleOrSvg: PropTypes.string.isRequired
}
App.defaultProps = { map: null }

function mapStateToProps(state) {
  return {
    map: state.map.map,
    isMobile: state.mobile,
    googleOrSvg: state.settings.map
  }
}

export default connect(mapStateToProps)(App)
