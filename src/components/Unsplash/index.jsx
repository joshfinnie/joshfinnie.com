/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';

const Unsplash = ({name, url = null}) => {
  if (url) {
    const finalUrl = `https://unsplash.com/@${url}`;
    return (
      <p className="unsplash mb-4 text-center">
        Photo by <a href={finalUrl}>{name}</a> on{' '}
        <a href="https://unsplash.com">Unsplash</a>
      </p>
    );
  }
  return (
    <p className="unsplash mb-4 text-center">
      Photo by {name} on <a href="https://unsplash.com">Unsplash</a>
    </p>
  );
};

Unsplash.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Unsplash;
