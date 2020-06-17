import React from 'react';
import PropTypes from 'prop-types';

const Talk = ({talk}) => (
  <div className="talk-data">
    <h2>
      {talk.link ? (
        <a href={talk.link} target="_blank" rel="noopener noreferrer">
          {talk.name}
        </a>
      ) : (
        <>{talk.name}</>
      )}
      {talk.lightning ? (
        <i className="fa fa-bolt bolt inline-icon" aria-hidden="true" />
      ) : (
        ''
      )}
    </h2>
    <p>
      <i className="far fa-building inline-icon" />
      <a href={talk.locationLink} target="_blank" rel="noopener noreferrer">
        {talk.location}
      </a>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <i className="fas fa-calendar-alt inline-icon" />
      {talk.date}
    </p>
  </div>
);

Talk.propTypes = {
  talk: PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    lightning: PropTypes.string.isRequired,
    locationLink: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
};

export default Talk;
