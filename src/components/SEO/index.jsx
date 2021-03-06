import React from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import {useStaticQuery, graphql} from 'gatsby';

import config from '../../utils/config';

const SEO = ({
  description,
  lang,
  location,
  meta,
  keywords,
  title,
  ogType,
  image,
}) => {
  const data = useStaticQuery(graphql`
    query DefaultSEOQuery {
      site {
        siteMetadata {
          title
          description
          author
        }
      }
    }
  `);
  const {
    title: siteTitle,
    description: siteDescription,
    author,
  } = data.site.siteMetadata;
  const metaTitle = title || siteTitle;
  const metaDescription = description || siteDescription;

  const ogImage = image
    ? {
        property: `og:image`,
        content: config.siteUrl + image,
      }
    : null;
  const ogImageUrl = image
    ? {
        property: `og:image:url`,
        content: config.siteUrl + image,
      }
    : null;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      titleTemplate={title ? `${title} | ${siteTitle}` : siteTitle}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title ? `${title} | ${siteTitle}` : siteTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: ogType || `website`,
        },
        {
          name: `twitter:card`,
          content: image ? `summary_large_image` : `summary`,
        },
        {
          name: `twitter:title`,
          content: metaTitle,
        },
        {
          name: `twitter:creator`,
          content: `@joshfinnie`,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:creator`,
          content: author,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : [],
        )
        .concat(
          location
            ? {
                name: 'og:url',
                content: location.href,
              }
            : [],
        )
        .concat(ogImage || [])
        .concat(ogImageUrl || [])
        .concat(meta)}
    />
  );
};

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: '',
  location: {
    href: '',
  },
  keywords: [
    'blog',
    'programming',
    'javascript',
    'python',
    'node',
    'react',
    'django',
    'gatsby',
    'personal site',
  ],
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  location: PropTypes.shape({href: PropTypes.string}),
  image: PropTypes.string.isRequired,
  meta: PropTypes.arrayOf(PropTypes.string),
  ogType: PropTypes.string.isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
};

export default SEO;
