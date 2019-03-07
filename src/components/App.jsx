import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactSidebar from 'react-sidebar';
import { Fragment } from 'redux-little-router';
import { getAirportData, getSvgMap } from '../actionCreators';
import ButtonGroup from './ButtonGroup';
import Error404 from './Error404';
import GoogleMapWrapper from './GoogleMapWrapper';
import SearchInput from './RouteInput/SearchInput';
import Sidebar from './Sidebar';
import SvgMap from './SvgMap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarDocked: true,
      isSidebarOpen: false,
      transitionsActive: false
    };

    this.toggleSidebarDock = this.toggleSidebarDock.bind(this);
    this.handleSetSidebarOpen = this.handleSetSidebarOpen.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getAirportData());
    dispatch(getSvgMap());
  }

  // FIXME: Give this to redux instead. This is awkward structure.
  toggleSidebarDock() {
    this.setState({ transitionsActive: true });
    this.setState({ isSidebarDocked: !this.state.isSidebarDocked });

    // Resize map to workaround the empty map bug, 300 is animation delay
    const { map } = this.props;
    setTimeout(
      () =>
        google.maps.event.trigger(
          map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
          'resize'
        ),
      300
    );
  }

  handleSetSidebarOpen(open) {
    this.setState({ transitionsActive: true });
    this.setState({ isSidebarOpen: open });
  }

  render() {
    const { isMobile } = this.props;

    return (
      <ReactSidebar
        sidebar={<Sidebar isMobile={isMobile} />}
        docked={!isMobile ? this.state.isSidebarDocked : false}
        open={isMobile ? this.state.isSidebarOpen : false}
        onSetOpen={this.handleSetSidebarOpen}
        transitions={this.state.transitionsActive}
        styles={{
          sidebar: { zIndex: 99 },
          overlay: { zIndex: 3 }
        }}
      >
        <div id="main">
          {isMobile && <SearchInput />}
          <div id="map-wrapper">
            <ButtonGroup
              isSidebarDocked={this.state.isSidebarDocked}
              toggleSidebarDock={this.toggleSidebarDock}
              handleSetSidebarOpen={this.handleSetSidebarOpen}
            />
            <Fragment
              withConditions={({ pathname }) => {
                return pathname === '/' || pathname === '/roadmap';
              }}
            >
              {/* TODO: Make a route for China */}
              <GoogleMapWrapper />
            </Fragment>
            <Fragment
              withConditions={({ pathname }) => {
                return pathname === '/cn' || pathname === '/cn/roadmap';
              }}
            >
              <GoogleMapWrapper country="cn" />
            </Fragment>
            <Fragment forRoute="/globe">
              <SvgMap />
            </Fragment>
            <Fragment
              withConditions={({ pathname }) => {
                return (
                  pathname !== '/' &&
                  pathname !== '/roadmap' &&
                  pathname !== '/globe' &&
                  pathname !== '/cn' &&
                  pathname !== '/cn/roadmap' &&
                  pathname !== '/cn/globe'
                );
              }}
            >
              <Error404 />
            </Fragment>
          </div>
        </div>
      </ReactSidebar>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  map: PropTypes.shape({ fitBounds: PropTypes.func }),
  isMobile: PropTypes.bool.isRequired
};
App.defaultProps = { map: null };

function mapStateToProps(state) {
  return {
    map: state.map,
    isMobile: state.isMobile
  };
}

export default connect(mapStateToProps)(App);
