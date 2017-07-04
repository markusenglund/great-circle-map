import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Select from "react-select"
import ErrorMessage from "./ErrorMessage"

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

    // TODO: Add more symbols that search should ignore: / ) ( etc
    const inputParts = input.split(/[.-\s]+/)
    const inputRegexString = inputParts.reduce((acc, val) => `${acc}[.-\\s]+${val}`)

    const inputStartOfWordRegex = new RegExp(`\\b${inputRegexString}`, "i")
    const inputEntireStringRegex = new RegExp(`^${inputRegexString}$`, "i")
    const inputStartOfStringRegex = new RegExp(`^${inputRegexString}`, "i")
    const inputUpperCase = input.toUpperCase()

    if (!input || input.length < 3) {
      return Promise.resolve({ options: [] })
    }

    // TODO: Make value dependent on label-state
    if (input.length === 3) {
      const matches = airportData
        .filter(airport =>
          // airport.iata === inputUpperCase || inputEntireStringRegex.test(airport.city)
          airport.iata === inputUpperCase ||
            inputStartOfWordRegex.test(airport.city) ||
            inputStartOfWordRegex.test(airport.name)
        )
        .map((airport, i) => {
          const value = airport.iata || airport.icao
          const sortValue = getSortValue(
            airport,
            inputEntireStringRegex,
            inputStartOfStringRegex,
            inputUpperCase
          )
          return { ...airport, label: `${airport.city} (${value}) ${airport.name}`, value, sortValue, index: i }
        })
        .sort((a, b) => {
          if (a.sortValue - b.sortValue === 0) {
            return a.index - b.index
          }
          return a.sortValue - b.sortValue
        })
        .slice(0, 10)
      return Promise.resolve({ options: matches })
      // return Promise.resolve({ options: matches })
    }

    if (input.length === 4) {
      const matches = airportData
        .filter(airport =>
          airport.icao === inputUpperCase ||
            inputStartOfWordRegex.test(airport.city) ||
            inputStartOfWordRegex.test(airport.name)
        )
        .map((airport, i) => {
          const value = airport.icao === inputUpperCase ?
            airport.icao :
            airport.iata || airport.icao
          const sortValue = getSortValue(
            airport,
            inputEntireStringRegex,
            inputStartOfStringRegex,
            inputUpperCase
          )
          return { ...airport, label: `${airport.city} (${value}) ${airport.name}`, value, sortValue, index: i }
        })
        .sort((a, b) => {
          if (a.sortValue - b.sortValue === 0) {
            return a.index - b.index
          }
          return a.sortValue - b.sortValue
        })
        .slice(0, 10)
      return Promise.resolve({ options: matches })
    }

    const cityMatches = airportData
      .filter(airport => (
        inputStartOfWordRegex.test(airport.city) || inputStartOfWordRegex.test(airport.name)
      ))
      .map((airport, i) => {
        const value = airport.iata || airport.icao
        const sortValue = getSortValue(
          airport,
          inputEntireStringRegex,
          inputStartOfStringRegex,
          inputUpperCase
        )
        return { ...airport, label: `${airport.city} (${value}) ${airport.name}`, value, sortValue, index: i }
      })
      .sort((a, b) => {
        if (a.sortValue - b.sortValue === 0) {
          return a.index - b.index
        }
        return a.sortValue - b.sortValue
      })
      .slice(0, 10)

    return Promise.resolve({ options: cityMatches })
  }

  handleChange(input) {
    this.setState({ value: input, menuRenderer: () => <div /> })
  }

  handleSubmit(event) {
    event.preventDefault()
    const { history, urlParam, dispatch } = this.props
    const { value } = this.state

    // Transform this.state.value to inputstring-format. Use urlParam to combine with old routes
    const valueString = value.reduce((acc, val, i) => {
      return i ? `${acc}-${val.value}` : val.value
    }, "")

    const newUrlParam = urlParam ?
      encodeURIComponent(`${valueString}, ${urlParam}`) :
      encodeURIComponent(valueString)

    dispatch({ type: "ENABLE_MAP_REBOUND" })
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
          <p>Enter two or more airports to draw a route between them on the map and calculate the distance.</p>
          <SelectAsync
            multi
            value={this.state.value}
            onChange={input => this.handleChange(input)}
            loadOptions={input => {
              return this.getOptions(input)
            }}
            onInputKeyDown={e => this.handleInputKeyDown(e)}
            valueRenderer={option => this.renderValue(option)}
            optionRenderer={option => this.renderOption(option)}
            arrowRenderer={() => undefined}
            ignoreCase={false}
            filterOptions={options => options}
            menuRenderer={this.state.menuRenderer}
            searchPromptText={null}
            placeholder="Name of city or airport-code"
          />
        </div>
        <ErrorMessage />
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
  airportData: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired
}
SearchInput.defaultProps = { urlParam: "" }

function mapStateToProps(state) {
  return { airportData: state.airportData }
}

export default connect(mapStateToProps)(SearchInput)
