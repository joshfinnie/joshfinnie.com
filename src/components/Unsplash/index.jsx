/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';

const Unsplash = ({name, url = null}) => {
  if (url) {
    const finalUrl = `https://unsplash.com/@${url}`;
    return (
      <p className="unsplash mb-4 text-center">
        <hr className="small-hr" />
        Article&apos;s main photo by <a href={finalUrl}>{name}</a> found on{' '}
        <a href="https://unsplash.com">Unsplash</a>.
      </p>
    );
  }
  return (
    <p className="unsplash mb-4 text-center">
      <hr className="small-hr" />
      Article&apos;s main photo by {name} found on{' '}
      <a href="https://unsplash.com">Unsplash</a>.
    </p>
  );
};

Unsplash.defaultProps = {
  url: null,
};

Unsplash.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
};

export default Unsplash;
