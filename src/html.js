/*  eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

export default class HTML extends React.Component {
  render() {
    const {
      body,
      bodyAttributes,
      headComponents,
      htmlAttributes,
      postBodyComponents,
      preBodyComponents,
    } = this.props;
    return (
      <html {...htmlAttributes}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
          />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
          />
          {headComponents}
        </head>
        <body {...bodyAttributes}>
          {preBodyComponents}
          <div
            key="body"
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: body }} // eslint-disable-line react/no-danger
          />
          {postBodyComponents}
        </body>
      </html>
    );
  }
}

HTML.propTypes = {
  body: PropTypes.string.isRequired,
  bodyAttributes: PropTypes.object.isRequired,
  headComponents: PropTypes.array.isRequired,
  htmlAttributes: PropTypes.object.isRequired,
  postBodyComponents: PropTypes.array.isRequired,
  preBodyComponents: PropTypes.array.isRequired,
};
