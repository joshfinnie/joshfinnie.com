import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import kebabCase from 'lodash/kebabCase';

const PostLink = ({ post }) => {
  const imgURL = _.get(post.frontmatter, 'image.publicURL');
  return (
    <div className="blog-post">
      <Link to={post.frontmatter.path} className="text-center">
        <h2 className="blog-post-title mt-3 mb-3">{post.frontmatter.title}</h2>
        <img src={imgURL} className="rounded-lg" />
      </Link>
      <p className="blog-post-meta text-center">
        <i className="fas fa-calendar-alt pl-2 pr-1" />
        {post.frontmatter.date}
        <i className="fas fa-tags pl-3" />
        {post.frontmatter.tags
          .map((tag, i) => {
            const lastIndex = post.frontmatter.tags.length - 1;
            return (
              <span key={i} className="tag pl-1">
                <Link to={`/tags/${kebabCase(tag)}/`}>
                  {tag}
                </Link>
                {i === lastIndex ? '' : ','}
              </span>
            );
          })
        }
      </p>
      <div className="row justify-content-center">
        <div className="col-4">
          <hr />
        </div>
      </div>
    </div>
  )
};

PostLink.propTypes = {
  post: PropTypes.shape({
    frontmatter: PropTypes.shape({
      path: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      image: PropTypes.shape({
        publicURL: PropTypes.string
      })
    }),
  }).isRequired,
};

export default PostLink;
