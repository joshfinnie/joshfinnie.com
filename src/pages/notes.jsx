import React from 'react';
import PropTypes from 'prop-types';
import {Link, graphql} from 'gatsby';

import Layout from '../components/Layout';
import SEO from '../components/SEO';

const NotesPage = ({
  data: {
    allMdx: {edges},
  },
}) => (
  <Layout>
    <SEO />
    <div className="main-div">
      <h1 className="text-center">Notes</h1>
      {edges.map(({node}) => (
        <Link to={node.frontmatter.path}>{node.frontmatter.title}</Link>
      ))}
    </div>
  </Layout>
);

NotesPage.propTypes = {
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
        }),
      ),
    }),
  }).isRequired,
};

export default NotesPage;

export const query = graphql`
  query {
    allMdx(
      filter: {fields: {collection: {eq: "notes"}}}
      sort: {fields: [frontmatter___date], order: DESC}
    ) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
  }
`;
