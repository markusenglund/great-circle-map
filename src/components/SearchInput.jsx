// TODO: Complete the optionRenderer, make sure search works correctly, maybe use highlighter

// Problems:
// Routes will be added one at a time. Change existing routes? How about removing?

import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Select from "react-select"

import "react-select/dist/react-select.css"

function getSortValue(airport, inputEntireStringRegex, inputStartOfStringRegex, inputUpperCase) {
  let sortValue
  if (airport.icao === inputUpperCase) {
    sortValue = 1
  } else if (airport.iata === inputUpperCase) {
    sortValue = 1
  } else if (inputEntireStringRegex.test(airport.city)) {
    sortValue = 1
  } else if (inputStartOfStringRegex.test(airport.city)) {
    sortValue = 2
  } else {
    sortValue = 3
  }
  if (!airport.iata) {
    sortValue += 0.5
  }
  return sortValue
}

class SearchInput extends Component {
  constructor(props) {
    super(props)
    this.state = { value: null }
  }

  getOptions(input) {
    const { airportData } = this.props

    const inputParts = input.split(/[.-\s]+/)
    const inputRegexString = inputParts.reduce((acc, val) => `${acc}[.-\\s]+${val}`)

    const inputStartOfWordRegex = new RegExp(`\\b${inputRegexString}`, "i")
    const inputEntireStringRegex = new RegExp(`^${inputRegexString}$`, "i")
    const inputStartOfStringRegex = new RegExp(`^${inputRegexString}`, "i")
    const inputUpperCase = input.toUpperCase()

    if (!input || input.length < 3) {
      return Promise.resolve({ options: [] })
    }

    if (input.length === 3) {
      const matches = airportData
        .filter(airport =>
          airport.iata === inputUpperCase || inputEntireStringRegex.test(airport.city)
        )
        .map((airport) => {
          const value = airport.iata || airport.icao
          return { ...airport, label: `${airport.city} (${value}) ${airport.name}`, value }
        })
      return Promise.resolve({ options: matches })
    }

    if (input.length === 4) {
      const matches = airportData
        .filter(airport =>
          airport.icao === inputUpperCase ||
            inputStartOfWordRegex.test(airport.city) ||
            inputStartOfWordRegex.test(airport.name)
        )
        .map((airport) => {
          const value = airport.icao === inputUpperCase ?
            airport.icao :
            airport.iata || airport.icao
          const sortValue = getSortValue(
            airport,
            inputEntireStringRegex,
            inputStartOfStringRegex,
            inputUpperCase
          )
          return { ...airport, label: `${airport.city} (${value}) ${airport.name}`, value, sortValue }
        })
        .sort((a, b) => a.sortValue - b.sortValue)
      return Promise.resolve({ options: matches })
    }

    const cityMatches = airportData
      .filter(airport => (
        inputStartOfWordRegex.test(airport.city) || inputStartOfWordRegex.test(airport.name)
      ))
      .map((airport) => {
        const value = airport.iata || airport.icao
        const sortValue = getSortValue(
          airport,
          inputEntireStringRegex,
          inputStartOfStringRegex,
          inputUpperCase
        )
        return { ...airport, label: `${airport.city} (${value}) ${airport.name}`, value, sortValue }
      })
      .sort((a, b) => a.sortValue - b.sortValue)

    return Promise.resolve({ options: cityMatches })
  }

  handleChange(input) {
    this.setState({ value: input, menuRenderer: () => <div /> })
  }

  handleSubmit(event) {
    event.preventDefault()
    const { history, urlParam } = this.props
    const { value } = this.state // Yes, value has a value attribute, deal with it

    // Transform this.state.value to inputstring-format. Use urlParam to combine with old routes
    const valueString = value.reduce((acc, val, i) => {
      return i ? `${acc}-${val.value}` : val.value
    }, "")

    const newUrlParam = urlParam ?
      encodeURIComponent(`${valueString}, ${urlParam}`) :
      encodeURIComponent(valueString)

    history.push(newUrlParam)
    this.setState({ value: null })
  }
  handleInputKeyDown(event) {
    if (event.keyCode === 13 && !event.target.value) { // Workaround for submitting form on enter
      event.preventDefault()
      this.handleSubmit(event)
    } else if (!event.target.value) {
      this.setState({ menuRenderer: undefined }) // Workaround city, one way ticket
    }
  }

  renderValue(option) {
    return <span>{option.value}</span>
  }

  renderOption(option) {
    return (
      <div>
        <div>{option.city} ({option.value})</div>
        <div className="italic">{option.name}</div>
      </div>
    )
  }


  render() {
    const SelectAsync = Select.Async

    return (
      <form className="input-form" onSubmit={e => this.handleSubmit(e)}>
        <div id="textarea-wrapper">
          <SelectAsync
            multi
            value={this.state.value}
            onChange={input => this.handleChange(input)}
            loadOptions={input => this.getOptions(input)}
            onInputKeyDown={e => this.handleInputKeyDown(e)}
            valueRenderer={option => this.renderValue(option)}
            optionRenderer={option => this.renderOption(option)}
            ignoreCase={false}
            filterOptions={options => options}
            menuRenderer={this.state.menuRenderer}
            searchPromptText={null}
          />
        </div>
        <div className="submit-button-wrapper">
          <button className="btn" type="submit">Go</button>
        </div>
      </form>
    )
  }
}

SearchInput.propTypes = {
  urlParam: PropTypes.string,
  history: PropTypes.shape({ push: PropTypes.function }).isRequired,
  airportData: PropTypes.arrayOf(PropTypes.object).isRequired
}
SearchInput.defaultProps = { urlParam: "" }

function mapStateToProps(state) {
  return { airportData: state.airportData }
}

export default connect(mapStateToProps)(SearchInput)
