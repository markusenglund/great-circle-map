import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import ColorPicker from "./ColorPicker"


class RouteColorPicker extends Component {
  constructor() {
    super()
    this.state = { pickerOpen: false }

    this.togglePicker = this.togglePicker.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  handleClickOutside() {
    this.setState({ pickerOpen: false })
  }

  togglePicker() {
    this.setState({ pickerOpen: !this.state.pickerOpen })
  }

  handleChange({ hex }) {
    const { dispatch } = this.props
    dispatch({ type: "DISABLE_MAP_REBOUND" })
    dispatch({ type: "CHANGE_ROUTE_COLOR", color: hex })
  }

  render() {
    const { routeColor } = this.props
    return (
      <div className="color-picker-selection">
        <div>Route color</div>
        <button
          className="color-picker-trigger"
          style={{ backgroundColor: routeColor }}
          onClick={this.togglePicker}
        />
        {this.state.pickerOpen ?
          <ColorPicker
            color={routeColor}
            handleChange={this.handleChange}
            handleClickOutside={this.handleClickOutside}
          /> :
          null
        }
      </div>
    )
  }
}

RouteColorPicker.propTypes = {
  routeColor: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return { routeColor: state.settings.routeColor }
}

export default connect(mapStateToProps)(RouteColorPicker)
