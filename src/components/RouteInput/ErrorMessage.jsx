import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRoutes } from '../../selectors';

function ErrorMessage({ error }) {
  return <div className="error-message">{error}</div>;
}

ErrorMessage.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};
ErrorMessage.defaultProps = { error: '' };

function mapStateToProps(state) {
  return { error: getRoutes(state).error };
}

export default connect(mapStateToProps)(ErrorMessage);
