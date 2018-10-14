import React from 'react';
import PropTypes from 'prop-types';

const Talk = ({ talk }) => (
  <>
    <h2 className="mb-3">
      <a
        href={talk.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {talk.name}
      </a>
      {talk.lightning ? <i className="fa fa-bolt bolt pl-2" aria-hidden="true" /> : ''}
      <a
        href={talk.locationLink}
        className="pl-5"
        target="_blank"
        rel="noopener noreferrer"
      >
        {talk.location}
      </a>
      <small className="pl-3">{talk.date}</small>
    </h2>
  </>
);

Talk.propType = {
  talk: PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    lightning: PropTypes.string.isRequired,
    locationLink: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }),
};

export default Talk;
