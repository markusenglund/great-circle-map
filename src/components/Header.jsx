import React from "react"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <Link to="/" title="Homepage">
      <div id="header">
        <img src="/logo.png" alt="logo" />
        <h1>Great Circle Map</h1>
      </div>
    </Link>
  )
}

export default Header
