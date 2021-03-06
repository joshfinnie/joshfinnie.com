import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';

import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import PostLink from '../components/PostLink';
import SEO from '../components/SEO';

const IndexPage = ({data}) => {
  const isFirst = true;
  const isLast = false;
  const prevPage = '/';
  const nextPage = '/blog/2/';
  const numPages = Math.ceil(data.allMdx.totalCount / 5);
  const currentPage = 1;

  return (
    <Layout>
      <SEO />
      <main role="main" className="main">
        {data.allMdx.edges.map(({node}) => (
          <PostLink post={node} key={node.id} />
        ))}
        <Pagination
          isFirst={isFirst}
          prevPage={prevPage}
          numPages={numPages}
          currentPage={currentPage}
          nextPage={nextPage}
          isLast={isLast}
        />
      </main>
    </Layout>
  );
};

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
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
    allMdx(
      filter: {fields: {collection: {eq: "posts"}}}
      sort: {fields: [frontmatter___date], order: DESC}
      limit: 5
      skip: 0
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
