const path = require('path');
const _ = require('lodash');

const postTemplate = path.resolve('./src/templates/blog-post.jsx');
const pageTemplate = path.resolve('./src/templates/page.jsx');
const tagTemplate = path.resolve('src/templates/tags.jsx');

exports.onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions;

  if (_.get(node, 'internal.type') === `MarkdownRemark`) {
    // Get the parent node
    const parent = getNode(_.get(node, 'parent'));

    createNodeField({
      node,
      name: 'collection',
      value: _.get(parent, 'sourceInstanceName'),
    });
  }
};

exports.createPages = ({graphql, actions}) => {
  const {createPage} = actions;

  return new Promise((resolve) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              id
              fields {
                collection
              }
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

      const allEdges = result.data.allMarkdownRemark.edges;

      // Create Pages
      const pages = allEdges.filter(
        (edge) => edge.node.fields.collection === `pages`,
      );
      pages.forEach(({node}) => {
        createPage({
          path: node.frontmatter.path,
          component: pageTemplate,
        });
      });

      // Create Posts
      const posts = allEdges.filter(
        (edge) => edge.node.fields.collection === `posts`,
      );
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
