import React from 'react';
import PropTypes from 'prop-types';

// Components
import {Link, graphql} from 'gatsby';

import Layout from '../components/Layout';
import SEO from '../components/SEO';

const Tags = ({pageContext, data}) => {
  const {tag} = pageContext;
  const {edges, totalCount} = data.allMdx;
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with '${tag}'`;

  return (
    <Layout>
      <SEO title={tagHeader} />
      <div className="main-div">
        <h1 className="text-center">{tagHeader}</h1>
        <ul>
          {edges.map(({node}) => {
            const {path, title} = node.frontmatter;
            return (
              <li>
                <Link
                  to={path}
                  className="list-group-item list-group-item-action"
                  key={node.id}
                >
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
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
    allMdx(
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
