/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';

import Tag from '../Tag';

const Byline = ({post}) => {
  const tagsLength = post.frontmatter.tags.length;
  return (
    <div className="main-div text-center">
      <i className="fas fa-calendar-alt inline-icon" />
      {post.frontmatter.date}
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <i className="fas fa-tags inline-icon" />
      {post.frontmatter.tags.map((tag, i) => (
        <Tag tag={tag} key={tag} length={tagsLength} index={i} />
      ))}
    </div>
  );
};

Byline.propTypes = {
  post: PropTypes.shape({
    frontmatter: PropTypes.shape({
      tags: PropTypes.array,
      date: PropTypes.string,
    }),
  }).isRequired,
};

export default Byline;
