/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import Byline from '../components/Byline';
import Layout from '../components/Layout';

const Post = ({ data }) => {
  const post = data.markdownRemark;
  const today = new Date();
  const postDate = new Date(post.frontmatter.date);
  const YEAR = 31536000000;
  let header;
  if (today - postDate > YEAR * 5 && post.frontmatter.expires) {
    header = (
      <>
        <h1 className="text-center text-danger pt-3">
          {post.frontmatter.title}
        </h1>
        <p className="text-center text-danger">
          <i className="fas fa-exclamation-triangle mr-2" />
          This blog post is more than 5 years old and most likely out of date!
          <i className="fas fa-exclamation-triangle ml-2" />
        </p>
      </>
    );
  } else if (today - postDate > YEAR && post.frontmatter.expires) {
    header = (
      <>
        <h1 className="text-center text-warning pt-3">
          {post.frontmatter.title}
        </h1>
        <p className="text-center text-warning">
          <i className="fas fa-exclamation-triangle mr-2" />
          This blog post is more than 1 year old and could be out of date!
          <i className="fas fa-exclamation-triangle ml-2" />
        </p>
      </>
    );
  } else {
    header = (<h1 className="text-center pt-3">{post.frontmatter.title}</h1>);
  }
  return (
    <Layout>
      <div>
        { header }
        <div className="pt-3" dangerouslySetInnerHTML={{ __html: post.html }} />
        <Byline post={post} />
      </div>
    </Layout>
  );
};

Post.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
      html: PropTypes.string,
    }),
  }).isRequired,
};

export default Post;

export const query = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path  }  }) {
      html
      frontmatter {
        title
        date
        tags
        expires
      }
    }
  }
`;
