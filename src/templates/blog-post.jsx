/* eslint-disable react/no-danger */
import React from 'react';

import PropTypes from 'prop-types';
import _ from 'lodash';
import {graphql} from 'gatsby';

import Byline from '../components/Byline';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const Post = ({data}) => {
  const post = data.markdownRemark;
  const today = new Date();
  const postDate = new Date(post.frontmatter.date);
  const YEAR = 31536000000;
  const imgURL = _.get(post.frontmatter, 'image.publicURL');
  let header;
  if (today - postDate > YEAR * 5 && post.frontmatter.expires) {
    header = (
      <span className="post-header">
        <h1 className="text-center text-danger">{post.frontmatter.title}</h1>
        <p className="text-center text-danger">
          <i className="fas fa-exclamation-triangle inline-icon" />
          This blog post is more than 5 years old and most likely out of date!
          <i className="fas fa-exclamation-triangle inline-icon" />
        </p>
      </span>
    );
  } else if (today - postDate > YEAR && post.frontmatter.expires) {
    header = (
      <span className="post-header">
        <h1 className="text-center text-warning">{post.frontmatter.title}</h1>
        <p className="text-center text-warning">
          <i className="fas fa-exclamation-triangle inline-icon" />
          This blog post is more than 1 year old and could be out of date!
          <i className="fas fa-exclamation-triangle inline-icon" />
        </p>
      </span>
    );
  } else {
    header = (
      <span className="post-header">
        <h1 className="text-center">{post.frontmatter.title}</h1>
      </span>
    );
  }
  return (
    <Layout>
      <SEO title={post.frontmatter.title} image={imgURL} ogType="article" />
      <img src={imgURL} className="round-img" alt="" />
      {header}
      <Byline post={post} />
      <div className="main-div" dangerouslySetInnerHTML={{__html: post.html}} />
    </Layout>
  );
};

Post.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.shape({
        expires: PropTypes.bool.isRequired,
        date: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        image: PropTypes.shape({
          publicURL: PropTypes.string,
        }),
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
