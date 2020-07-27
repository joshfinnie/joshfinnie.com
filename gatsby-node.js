const path = require('path');
const _ = require('lodash');

exports.onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions;

  if (_.get(node, 'internal.type') === `Mdx`) {
    // Get the parent node
    const parent = getNode(_.get(node, 'parent'));

    createNodeField({
      node,
      name: 'collection',
      value: _.get(parent, 'sourceInstanceName'),
    });
  }
};

exports.createPages = async ({graphql, actions, reporter}) => {
  const {createPage} = actions;

  const result = await graphql(`
    {
      allMdx {
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
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const allEdges = result.data.allMdx.edges;

  // Create Pages
  const pages = allEdges.filter(
    (edge) => edge.node.fields.collection === `pages`,
  );
  pages.forEach(({node}) => {
    createPage({
      path: node.frontmatter.path,
      component: path.resolve('./src/templates/page.jsx'),
    });
  });

  // Create Notes
  const notes = allEdges.filter(
    (edge) => edge.node.fields.collection === `notes`,
  );
  notes.forEach(({node}) => {
    createPage({
      path: node.frontmatter.path,
      component: path.resolve('./src/templates/note.jsx'),
    });
  });

  // Create Posts
  const posts = allEdges.filter(
    (edge) => edge.node.fields.collection === `posts`,
  );
  posts.forEach(({node}) => {
    createPage({
      path: node.frontmatter.path,
      component: path.resolve('./src/templates/blog-post.jsx'),
    });
  });

  // Create pagination pages
  const POSTS_PER_PAGE = 5;
  const numPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  Array.from({length: numPages}).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: path.resolve('./src/templates/blog-list-template.jsx'),
      context: {
        limit: POSTS_PER_PAGE,
        skip: i * POSTS_PER_PAGE,
        numPages,
        currentPage: i + 1,
      },
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
      component: path.resolve('src/templates/tags.jsx'),
      context: {
        tag,
      },
    });
  });
};
