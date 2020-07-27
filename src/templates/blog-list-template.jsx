import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';

import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import PostLink from '../components/PostLink';
import SEO from '../components/SEO';

const BlogList = ({data, pageContext}) => {
  const {currentPage, numPages} = pageContext;
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage =
    currentPage - 1 === 1 ? '/' : `/blog/${(currentPage - 1).toString()}`;
  const nextPage = `/blog/${(currentPage + 1).toString()}`;
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

BlogList.propTypes = {
  pageContext: PropTypes.shape({
    numPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
        }),
      ),
    }),
  }).isRequired,
};

export const query = graphql`
  query blogListQuery($limit: Int!, $skip: Int!) {
    allMdx(
      filter: {fields: {collection: {eq: "posts"}}}
      sort: {fields: [frontmatter___date], order: DESC}
      limit: $limit
      skip: $skip
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

export default BlogList;
