import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
// import axios from "axios"
import Sidebar from "react-sidebar"
import { handleRoutes } from "../actionCreators"
import Header from "./Header"
import Map from "./Map"
import RouteInput from "./RouteInput"
import RouteList from "./RouteList"
import ButtonGroup from "./ButtonGroup"
// import ZoomButtons from "./ZoomButtons"

class Main extends Component {
  constructor() {
    super()
    this.state = { isSidebarDocked: true, isSidebarOpen: true, transitionsActive: false }

    this.toggleSidebarDock = this.toggleSidebarDock.bind(this)
    this.handleSetSidebarOpen = this.handleSetSidebarOpen.bind(this)
  }

  componentWillMount() {
    const { dispatch } = this.props
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      dispatch({ type: "IS_MOBILE" })
    }

    // Check if user is in China and set state
  //   axios.get("https://freegeoip.net/json/")
  //     .then((res) => {
  //       console.log("should be location", res)
  //       dispatch({ type: "GET_LOCATION", location: res.data.country_code })
  //     })
  }

  // componentDidMount() {
  //   this.setState({ transitionsActive: true })
  // }

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

  handleSetSidebarOpen(open) {
    this.setState({ transitionsActive: true })
    this.setState({ isSidebarOpen: open })
  }

  render() {
    const { match, history, map, buttonsVisible, isMobile } = this.props
    const decodedUrlParam = match.params.string ? decodeURIComponent(match.params.string) : ""

    const sidebarContent = (
      <div className="left-column">
        {!isMobile ? <Header /> : null}
        <RouteInput urlParam={decodedUrlParam} history={history} />
        <RouteList urlParam={decodedUrlParam} history={history} />
      </div>
    )

    return (
      <Sidebar
        sidebar={sidebarContent}
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
            {/* {!isMobile ? <ZoomButtons map={map} buttonsVisible={buttonsVisible} /> : null} */}
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
  buttonsVisible: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired
}
Main.defaultProps = {
  map: null
}

function mapStateToProps(state) {
  return {
    map: state.map.map,
    buttonsVisible: state.settings.buttonsVisible,
    isMobile: state.mobile
  }
}

export default connect(mapStateToProps)(Main)
