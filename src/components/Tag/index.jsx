/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';

// Utilities
import kebabCase from 'lodash/kebabCase';

const Tag = ({tag}) => (
  <React.Fragment>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
    <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>,<br />
  </React.Fragment>
);

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
};

export default Tag;
