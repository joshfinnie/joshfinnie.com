/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';

// Utilities
import kebabCase from 'lodash/kebabCase';

const Tag = ({tag, length, index}) =>
  length !== index + 1 ? (
    <>
      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>,&nbsp;
    </>
  ) : (
    <>
      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
    </>
  );

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default Tag;
