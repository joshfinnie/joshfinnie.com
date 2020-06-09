/* eslint-disable react/no-danger */
import React from 'react';

import PropTypes from 'prop-types';
import {graphql} from 'gatsby';

import Layout from '../components/Layout';
import SEO from '../components/SEO';

const Post = ({data}) => {
  const page = data.markdownRemark;
  return (
    <Layout>
      <SEO title={page.frontmatter.title} />
      <span className="post-header">
        <h1 className="text-center">{page.frontmatter.title}</h1>
      </span>
      <div className="main-div" dangerouslySetInnerHTML={{__html: page.html}} />
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
    markdownRemark(frontmatter: {path: {eq: $path}}) {
      html
      frontmatter {
        title
        date
        tags
        expires
        image {
          publicURL
        }
      }
    }
  }
`;
