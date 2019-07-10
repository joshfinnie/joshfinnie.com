import React from 'react';
import PropTypes from 'prop-types';

const Readtime = ({words}) => {
  const readTime = Math.ceil(words / 265);
  const content =
    readTime > 1
      ? `Read Time: About ${readTime} minutes.`
      : 'Read Time: About 1 minute.';

  return <div className="readtime">{content}</div>;
};

Readtime.propTypes = {
  words: PropTypes.string.isRequired,
};

export default Readtime;
