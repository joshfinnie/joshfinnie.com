import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';

import Layout from '../components/Layout';
import PostLink from '../components/PostLink';
import SEO from '../components/SEO';

const IndexPage = ({data}) => (
  <Layout>
    <SEO />
    <main role="main" className="main">
      {data.allMarkdownRemark.edges.map(({node}) => (
        <PostLink post={node} key={node.id} />
      ))}
    </main>
  </Layout>
);

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
        }),
      ),
    }),
  }).isRequired,
};

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: {fields: {collection: {eq: "posts"}}}
      sort: {fields: [frontmatter___date], order: DESC}
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
            tags
            image {
              publicURL
            }
          }
          excerpt
        }
      }
    }
  }
`;

export default IndexPage;
