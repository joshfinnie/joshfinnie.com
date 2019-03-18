import React from 'react';
import PropTypes from 'prop-types';

// Components
import {Link, graphql} from 'gatsby';

import Layout from '../components/Layout';

const Tags = ({pageContext, data}) => {
  const {tag} = pageContext;
  const {edges, totalCount} = data.allMarkdownRemark;
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with '${tag}'`;

  return (
    <Layout>
      <main role="main" className="container">
        <div className="row">
          <div className="col-md-12 pb-5">
            <h1 className="pt-3">{tagHeader}</h1>
            <div className="mb-3">
              <Link to="/tags">Back to all tags</Link>
            </div>
            <div className="list-group">
              {edges.map(({node}) => {
                const {path, title} = node.frontmatter;
                return (
                  <Link
                    to={path}
                    className="list-group-item list-group-item-action"
                    key={node.id}
                  >
                    {title}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              path: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired,
      ),
    }),
  }).isRequired,
};

export default Tags;

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: {fields: [frontmatter___date], order: DESC}
      filter: {frontmatter: {tags: {in: [$tag]}}}
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            path
          }
        }
      }
    }
  }
`;
