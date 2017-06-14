// TODO:
// Split up RouteInput so RouteInput and SearchInput can share common things
// Make radiobuttons actually change shown component


// Problems: The url/state is based on an input-string, but new input is not a string
// There is some overlap, and many differences between these inputs. How to avoid duplication?
// Routes will be added one at a time. Change existing routes? How about removing?

import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Select from "react-select"
// import VirtualizedSelect from "react-virtualized-select"
// import createFilterOptions from "react-select-fast-filter-options"

import "react-select/dist/react-select.css"
// import "react-virtualized/styles.css"
// import "react-virtualized-select/styles.css"

class SearchInput extends Component {
  constructor(props) {
    super(props)

    // // Maybe in redux store instead
    // const options = props.airportData.map((airport) => {
    //   return { ...airport, label: `${airport.name} (${airport.iata || airport.icao})` }
    // })
    // // None of this makes any sense
    // const filterOptions = createFilterOptions({
    //   options,
    //   valueKey: "iata",
    //   indexes: ["iata", "name", "city"]
    // })

    this.state = { value: null }
  }

  getOptions(input) {
    const { airportData } = this.props
    if (!input || input.length < 3) {
      return Promise.resolve({ options: [] })
    }
    if (input.length === 3) {
      const inputUpperCase = input.toUpperCase()
      const iataMatch = airportData.find(airport => airport.iata === inputUpperCase)
      if (iataMatch) {
        return Promise.resolve({ options: [{ label: `${iataMatch.city} (${iataMatch.iata})`, value: iataMatch.iata }] })
      }
      return Promise.resolve({ options: [] })
    }
    if (input.length === 4) {
      const inputUpperCase = input.toUpperCase()
      const icaoMatch = airportData.find(airport => airport.icao === inputUpperCase)
      if (icaoMatch) {
        return Promise.resolve({ options: [{ label: `${icaoMatch.city} (${icaoMatch.icao})`, value: icaoMatch.icao }] })
      }
      return Promise.resolve({ options: [] })
    }
    const regex = new RegExp(input, "i")
    const cityMatches = airportData
      .filter(airport => regex.test(airport.city))
      .map((airport) => {
        return { label: `${airport.city} (${airport.iata}) ${airport.name}`, value: airport.iata }
      })
    return Promise.resolve({ options: cityMatches })
  }

  handleChange(input) {
    console.log(input)
    this.setState({ value: input })
  }

  handleSubmit(event) {
    event.preventDefault()
    const { history, urlParam } = this.props

    // Transform this.state.value to inputstring-format. Use urlParam to combine with old routes

    const newUrlParam = encodeURIComponent(this.state.value)
    history.push(`/${urlParam},${newUrlParam}`)
    this.setState({ value: null })
  }


  render() {
    // const { airportData } = this.props
    // const options = airportData.map((airport) => {
    //   return { ...airport, label: `${airport.name} (${airport.iata || airport.icao})`}
    // })
    // const filterOptions = createFilterOptions({
    //   options: options,
    //   labelKey: "city",
    //   valueKey: "iata",
    //   indexes: ["city", "iata"]
    // })
    // const { options, filterOptions } = this.state
    const SelectAsync = Select.Async

    return (
      <form className="input-form" onSubmit={e => this.handleSubmit(e)}>
        <div id="textarea-wrapper">
          <SelectAsync
            multi={this.state.multi}
            value={this.state.value}
            onChange={input => this.handleChange(input)}
            loadOptions={input => this.getOptions(input)}
          />
          {/* <VirtualizedSelect
            filterOptions={filterOptions}
            options={options}
            simpleValue
            clearable
            multi
            value={this.state.value}
            onChange={e => this.handleChange(e)}
            valueKey="iata"
          /> */}
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
