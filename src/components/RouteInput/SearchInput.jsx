import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-little-router';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './react-select.scss';

// Sort search results
function getSortValue(airport, inputEntireStringRegex, inputStartOfStringRegex, inputUpperCase) {
  let sortValue;
  if (airport.icao === inputUpperCase) {
    sortValue = 1;
  } else if (airport.iata === inputUpperCase) {
    sortValue = 1;
  } else if (inputEntireStringRegex.test(airport.city)) {
    sortValue = 1;
  } else if (inputStartOfStringRegex.test(airport.city)) {
    sortValue = 2;
  } else {
    sortValue = 3;
  }
  if (!airport.iata) {
    sortValue += 0.5;
  }
  return sortValue;
}

class SearchInput extends Component {
  constructor(props) {
    super(props);

    this.handleSelectMounted = this.handleSelectMounted.bind(this);
  }

  // FIXME: There's a lot of repetitive code here
  getOptions(input) {
    const { airportData } = this.props;

    const inputParts = input.split(/[.-\s]+/);
    const inputRegexString = inputParts.reduce((acc, val) => `${acc}[.-\\s]+${val}`);

    const inputStartOfWordRegex = new RegExp(`\\b${inputRegexString}`, 'i');
    const inputEntireStringRegex = new RegExp(`^${inputRegexString}$`, 'i');
    const inputStartOfStringRegex = new RegExp(`^${inputRegexString}`, 'i');
    const inputUpperCase = input.toUpperCase();

    if (!input || input.length < 3) {
      return Promise.resolve({ options: [] });
    }

    if (input.length === 3) {
      const matches = airportData
        .filter(
          airport =>
            airport.iata === inputUpperCase ||
            inputStartOfWordRegex.test(airport.city) ||
            inputStartOfWordRegex.test(airport.name)
        )
        .map((airport, i) => {
          const value = airport.iata || airport.icao;
          const sortValue = getSortValue(
            airport,
            inputEntireStringRegex,
            inputStartOfStringRegex,
            inputUpperCase
          );
          return {
            ...airport,
            label: `${airport.city} (${value}) ${airport.name}`,
            value,
            sortValue,
            index: i
          };
        })
        .sort((a, b) => {
          if (a.sortValue - b.sortValue === 0) {
            return a.index - b.index;
          }
          return a.sortValue - b.sortValue;
        })
        .slice(0, 10);
      return Promise.resolve({ options: matches });
    }

    if (input.length === 4) {
      const matches = airportData
        .filter(
          airport =>
            airport.icao === inputUpperCase ||
            inputStartOfWordRegex.test(airport.city) ||
            inputStartOfWordRegex.test(airport.name)
        )
        .map((airport, i) => {
          const value =
            airport.icao === inputUpperCase ? airport.icao : airport.iata || airport.icao;
          const sortValue = getSortValue(
            airport,
            inputEntireStringRegex,
            inputStartOfStringRegex,
            inputUpperCase
          );
          return {
            ...airport,
            label: `${airport.city} (${value}) ${airport.name}`,
            value,
            sortValue,
            index: i
          };
        })
        .sort((a, b) => {
          if (a.sortValue - b.sortValue === 0) {
            return a.index - b.index;
          }
          return a.sortValue - b.sortValue;
        })
        .slice(0, 10);
      return Promise.resolve({ options: matches });
    }

    const cityMatches = airportData
      .filter(
        airport =>
          inputStartOfWordRegex.test(airport.city) || inputStartOfWordRegex.test(airport.name)
      )
      .map((airport, i) => {
        const value = airport.iata || airport.icao;
        const sortValue = getSortValue(
          airport,
          inputEntireStringRegex,
          inputStartOfStringRegex,
          inputUpperCase
        );
        return {
          ...airport,
          label: `${airport.city} (${value}) ${airport.name}`,
          value,
          sortValue,
          index: i
        };
      })
      .sort((a, b) => {
        if (a.sortValue - b.sortValue === 0) {
          return a.index - b.index;
        }
        return a.sortValue - b.sortValue;
      })
      .slice(0, 10);

    return Promise.resolve({ options: cityMatches });
  }

  // Make a reference to the select dom-component so it can be blurred
  handleSelectMounted(selectWrapper) {
    if (selectWrapper) {
      this.select = selectWrapper.select;
    }
  }

  handleChange(input) {
    const { dispatch } = this.props;
    dispatch({ type: 'CHANGE_SEARCH_INPUT', input });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { routeString, dispatch, isMobile, inputValue } = this.props;

    if (isMobile) {
      this.select.blurInput();
    }

    if (!inputValue) return;
    // Transform inputValue to inputstring-format. Use urlParam to combine with old routes
    const addedRoute = inputValue.reduce((acc, val, i) => {
      return i ? `${acc}-${val.value}` : val.value;
    }, '');

    // Remove trailing commas, semicolons, slashes or new line
    // const urlParamNoDangle = urlParam.replace(/[,;/\n]$/, '');

    const newRouteString = routeString ? `${routeString}, ${addedRoute}` : addedRoute;

    dispatch({ type: 'ENABLE_MAP_REBOUND' });
    dispatch(push({ query: { routes: newRouteString } }));
    dispatch({ type: 'CHANGE_SEARCH_INPUT', input: null });
  }

  /* eslint-disable class-methods-use-this */
  renderValue(option) {
    return <span>{option.value}</span>;
  }

  renderOption(option) {
    return (
      <div>
        <div>
          {option.city} ({option.value})
        </div>
        <div className="italic">{option.name}</div>
      </div>
    );
  }
  /* eslint-enable class-methods-use-this */

  render() {
    const SelectAsync = Select.Async;
    const { inputValue, isMobile } = this.props;

    return (
      <div className="search-input">
        <p className="description">
          Enter two or more airports to draw a route between them on the map and calculate the
          distance.
        </p>
        <form
          className={isMobile ? 'input-form-mobile' : 'input-form'}
          onSubmit={e => this.handleSubmit(e)}
        >
          <div id="select-wrapper">
            <SelectAsync
              multi
              value={inputValue}
              onChange={input => this.handleChange(input)}
              loadOptions={input => {
                return this.getOptions(input);
              }}
              valueRenderer={option => this.renderValue(option)}
              optionRenderer={option => this.renderOption(option)}
              arrowRenderer={() => undefined}
              ignoreCase={false}
              filterOptions={options => options}
              searchPromptText={null}
              placeholder="Name of city or airport-code"
              ref={this.handleSelectMounted}
            />
          </div>
          <div className={isMobile ? 'submit-button-wrapper' : 'submit-button-wrapper'}>
            <button className="btn" type="submit">
              Go
            </button>
          </div>
        </form>
      </div>
    );
  }
}

SearchInput.propTypes = {
  routeString: PropTypes.string.isRequired,
  airportData: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  inputValue: PropTypes.arrayOf(PropTypes.object)
};
SearchInput.defaultProps = { inputValue: null };

function mapStateToProps(state) {
  return {
    airportData: state.airportData,
    isMobile: state.mobile,
    routeString: state.router.query.routes || '',
    inputValue: state.searchInput
  };
}

export default connect(mapStateToProps)(SearchInput);
