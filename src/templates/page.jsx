/* eslint-disable react/no-danger */
import React from 'react';

import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import {MDXRenderer} from 'gatsby-plugin-mdx';

import Layout from '../components/Layout';
import SEO from '../components/SEO';

const Page = ({data}) => {
  const page = data.mdx;
  return (
    <Layout>
      <SEO title={page.frontmatter.title} />
      <span className="post-header">
        <h1 className="text-center">{page.frontmatter.title}</h1>
      </span>
      <div className="main-div">
        <MDXRenderer>{page.body}</MDXRenderer>
      </div>
    </Layout>
  );
};

Page.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
      body: PropTypes.string,
    }),
  }).isRequired,
};

export default Page;

export const query = graphql`
  query($path: String!) {
    mdx(frontmatter: {path: {eq: $path}}) {
      body
      frontmatter {
        title
      }
    }
  }
`;
