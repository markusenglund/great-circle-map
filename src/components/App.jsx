import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import ReactSidebar from "react-sidebar"

import { getRoutesFromUrl } from "../actionCreators"
import Sidebar from "./Sidebar"
import Map from "./Map"
import ButtonGroup from "./ButtonGroup"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { isSidebarDocked: true, isSidebarOpen: true, transitionsActive: false }

    const { dispatch, match, history } = props
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      dispatch({ type: "IS_MOBILE" })
    }

    dispatch({ type: "DECODE_URL", param: match.params.string, history })

    this.toggleSidebarDock = this.toggleSidebarDock.bind(this)
    this.handleSetSidebarOpen = this.handleSetSidebarOpen.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // When we receive new props (meaning route parameters) we dispatch getRoutesFromUrl action
    const { match, dispatch } = this.props
    if (nextProps.match.params.string !== match.params.string) {
      dispatch({ type: "DECODE_URL", param: nextProps.match.params.string, history: nextProps.history })
      dispatch(getRoutesFromUrl())
    }
  }

  toggleSidebarDock() {
    this.setState({ transitionsActive: true })
    this.setState({ isSidebarDocked: !this.state.isSidebarDocked })

    // Resize map to workaround the empty map bug, 300 is animation delay
    const { map } = this.props
    setTimeout(() =>
      google.maps.event.trigger(map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, "resize"),
      300
    )
  }

  handleSetSidebarOpen(open) {
    this.setState({ transitionsActive: true })
    this.setState({ isSidebarOpen: open })
  }

  render() {
    const { history, buttonsVisible, isMobile } = this.props

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
          <div id="map-wrapper">
            <ButtonGroup
              isSidebarDocked={this.state.isSidebarDocked}
              toggleSidebarDock={this.toggleSidebarDock}
              handleSetSidebarOpen={this.handleSetSidebarOpen}
              isMobile={isMobile}
              history={history}
              buttonsVisible={buttonsVisible}
            />
            <Map />
          </div>
        </div>
      </ReactSidebar>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({ params: PropTypes.object }).isRequired,
  history: PropTypes.shape({ push: PropTypes.function }).isRequired,
  map: PropTypes.shape({ fitBounds: PropTypes.func }),
  buttonsVisible: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired
}
App.defaultProps = {
  map: null
}

function mapStateToProps(state) {
  return {
    map: state.map.map,
    buttonsVisible: state.settings.buttonsVisible,
    isMobile: state.mobile
  }
}

export default connect(mapStateToProps)(App)
