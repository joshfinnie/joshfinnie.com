/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import {Link, graphql} from 'gatsby';

import kebabCase from 'lodash/kebabCase';

import Layout from '../components/Layout';
import SEO from '../components/SEO';

const TagsPage = ({
  data: {
    allMarkdownRemark: {group},
  },
}) => (
  <Layout>
    <SEO title="Tags" />
    <div className="main-div">
      <h1 className="text-center">Tags</h1>
      <ul className="column3">
        {group
          .sort((a, b) => b.totalCount - a.totalCount)
          .map((tag) => {
            const tagBadge = `${tag.totalCount} post${
              tag.totalCount === 1 ? '' : 's'
            }`;
            return (
              <li>
                <Link
                  key={tag}
                  to={`/tags/${kebabCase(tag.fieldValue)}/`}
                  className="list-group-item list-group-item-action">
                  {tag.fieldValue} ({tagBadge})
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  </Layout>
);

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired,
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

export default TagsPage;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
