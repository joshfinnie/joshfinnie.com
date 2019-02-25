import React from 'react';
import PropTypes from 'prop-types';

const Talk = ({ talk }) => (
  <>
    <div class="card text-center">
      <div class="card-body">
        <a
          href={talk.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 class="card-title">
            {talk.name}
            {talk.lightning ? <i className="fa fa-bolt bolt pl-2" aria-hidden="true" /> : ''}
          </h3>
        </a>
        <p>
          <i className="fa fa-city" aria-hidden="true" />
          <a
            href={talk.locationLink}
            className="pl-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {talk.location}
          </a>
          <i className="fa fa-calendar-alt pl-5" aria-hidden="true" /><span className="pl-2">{talk.date}</span>
        </p>
      </div>
    </div>
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
