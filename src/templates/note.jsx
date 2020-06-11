/* eslint-disable react/no-danger */
import React from 'react';

import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import {MDXRenderer} from 'gatsby-plugin-mdx';

import Layout from '../components/Layout';
import SEO from '../components/SEO';

const Note = ({data}) => {
  const note = data.mdx;
  return (
    <Layout>
      <SEO title={note.frontmatter.title} />
      <span className="post-header">
        <h1 className="text-center">{note.frontmatter.title}</h1>
      </span>
      <div className="main-div">
        <MDXRenderer>{note.body}</MDXRenderer>
      </div>
    </Layout>
  );
};

Note.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
      body: PropTypes.string,
    }),
  }).isRequired,
};

export default Note;

export const query = graphql`
  query($path: String!) {
    mdx(frontmatter: {path: {eq: $path}}) {
      body
      frontmatter {
        title
        date
      }
    }
  }
`;
