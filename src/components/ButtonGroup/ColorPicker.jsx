import React, { Component } from "react"
import PropTypes from "prop-types"
import onClickOutside from "react-onclickoutside"
import { GithubPicker } from "react-color"

class ColorPicker extends Component {
  handleClickOutside() {
    const { handleClickOutside } = this.props
    handleClickOutside()
  }

  render() {
    const { color, handleChange } = this.props
    return (
      <div className="color-picker">
        <GithubPicker
          onChange={handleChange}
          triangle="top-right"
          color={color}
          colors={["#D03030", "#B80000", "#DB3E00", "#FCCB00", "#008B02", "#12DEDE", "#004DCF", "#5300EB", "#EB9694", "#FAD0C3", "#FEF3BD", "#F1D175", "#8EFAAC", "#A4BED6", "#8EA3F3", "#111111"]}
        />
      </div>
    )
  }
}

export default onClickOutside(ColorPicker)
