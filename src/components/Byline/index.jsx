/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';

import Tag from '../Tag';

const Byline = ({post}) => (
  <div data-language="json" className="mt-5 mb-4">
    <div className="row justify-content-center">
      <div className="col-4">
        <hr />
      </div>
    </div>
    <pre>
      <code>
        &#123;
        <br />
        &nbsp;&nbsp;metaData: &#123;
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;author: Josh Finnie
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;tags: &#91;
        <br />
        {post.frontmatter.tags.map((tag) => (
          <Tag tag={tag} key={tag} />
        ))}
        &nbsp;&nbsp;&nbsp;&nbsp;&#93;,
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;postDate: {post.frontmatter.date}
        <br />
        &nbsp;&nbsp;&#125;
        <br />
        &#125;
        <br />
      </code>
    </pre>
  </div>
);

Byline.propTypes = {
  post: PropTypes.shape({
    frontmatter: PropTypes.shape({
      tags: PropTypes.array,
      date: PropTypes.string,
    }),
  }).isRequired,
};

export default Byline;
