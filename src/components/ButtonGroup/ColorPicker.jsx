import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { GithubPicker } from "react-color"

class ColorPicker extends Component {
  constructor() {
    super()
    this.state = { pickerOpen: false }

    this.handleOpenPicker = this.handleOpenPicker.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleOpenPicker() {
    this.setState({ pickerOpen: true })
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
          onClick={this.handleOpenPicker}
        />
        {this.state.pickerOpen ?
          <div className="color-picker">
            <GithubPicker
              onChange={this.handleChange}
              triangle="top-right"
              color={routeColor}
              colors={["#B80000", "#DB3E00", "#FCCB00", "#008B02", "#006B76", "#1273DE", "#004DCF", "#5300EB", "#EB9694", "#FAD0C3", "#FEF3BD", "#C1E1C5", "#BEDADC", "#C4DEF6", "#BED3F3", "#D4C4FB"]}
            />
          </div> :
          null
        }
      </div>
    )
  }
}

ColorPicker.propTypes = {
  routeColor: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return { routeColor: state.settings.routeColor }
}

export default connect(mapStateToProps)(ColorPicker)
