module.exports = {
  siteMetadata: {
    title: 'www.joshfinnie.com',
    author: 'Josh Finnie',
    description: 'The personal/professional page of Josh Finnie.',
    siteUrl: 'https://www.joshfinnie.com',
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/posts`,
        name: `posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/mdpages`,
        name: `pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/notes`,
        name: `notes`,
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-250621-15',
        head: false,
        anonymize: true,
        respectDNT: true,
        exclude: [],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#0f99a3',
        theme_color: '#0f99a3',
        display: 'browser',
        icon: 'src/images/my-icon.png',
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1140,
              withWebp: true,
              quality: 80,
            },
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-feed-mdx',
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
        `,
        feeds: [
          {
            serialize: ({query: {site, allMdx}}) => {
              return allMdx.edges.map((edge) => {
                return {
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                  guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                  custom_elements: [{'content:encoded': edge.node.html}],
                  ...edge.node.frontmatter,
                };
              });
            },
            query: `
            {
              allMdx(
                filter: {fields: {collection: {eq: "posts"}}},
                sort: { order: DESC, fields: [frontmatter___date] },
              ) {
                edges {
                  node {
                    html
                    frontmatter {
                      title
                      date
                      path
                    }
                  }
                }
              }
            }
            `,
            output: '/rss.xml',
            title: "Josh Finnie's RSS Feed",
          },
        ],
      },
    },
  ],
};
