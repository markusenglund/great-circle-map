import React from 'react';
import { Link } from 'redux-little-router';

export default function Error404() {
  return (
    <div className="error-page">
      <h2>Error 404 - page not found</h2>
      <p>
        <Link className="error-link" href="/">
          Click here
        </Link>{' '}
        to get back to the main page.
      </p>
    </div>
  );
}
