/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');
const _ = require('lodash');

const postTemplate = path.resolve('./src/templates/blog-post.jsx');
const tagTemplate = path.resolve('src/templates/tags.jsx');

exports.createPages = ({graphql, actions}) => {
  const {createPage} = actions;

  return new Promise((resolve) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              id
              frontmatter {
                title
                path
                tags
              }
            }
          }
        }
      }
    `).then((result) => {
      if (result.errors) {
        return Promise.reject(result.errors);
      }

      // Create Posts
      const posts = result.data.allMarkdownRemark.edges;
      posts.forEach(({node}) => {
        createPage({
          path: node.frontmatter.path,
          component: postTemplate,
        });
      });

      // Create Tags
      let tags = [];
      _.each(posts, (edge) => {
        if (_.get(edge, 'node.frontmatter.tags')) {
          tags = tags.concat(edge.node.frontmatter.tags);
        }
      });
      // Eliminate duplicate tags
      tags = _.uniq(tags);

      // Make tag pages
      tags.forEach((tag) => {
        createPage({
          path: `/tags/${_.kebabCase(tag)}/`,
          component: tagTemplate,
          context: {
            tag,
          },
        });
      });
      resolve();
    });
  });
};
