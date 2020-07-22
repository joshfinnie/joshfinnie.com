import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';

import './pagination.css';

const Pagination = ({
  isFirst,
  prevPage,
  numPages,
  currentPage,
  nextPage,
  isLast,
}) => (
  <ul className="pagination">
    {!isFirst && (
      <li className="pag-item">
        <Link className="link" to={prevPage} rel="prev">
          ←
        </Link>
      </li>
    )}
    {Array.from({length: numPages}, (_, i) => (
      <li
        className={`pag-item${currentPage === i + 1 ? ' active' : ''}`}
        key={`pagination-number${i + 1}`}
      >
        {i === 0 ? (
          <Link className="link" to="/" disabled={currentPage === i + 1}>
            1
          </Link>
        ) : (
          <Link className="link" to={`/blog/${i + 1}`}>
            {i + 1}
          </Link>
        )}
      </li>
    ))}
    {!isLast && (
      <li className="pag-item">
        <Link className="link" to={nextPage} rel="next">
          →
        </Link>
      </li>
    )}
  </ul>
);

Pagination.propTypes = {
  isFirst: PropTypes.bool.isRequired,
  prevPage: PropTypes.number.isRequired,
  numPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  nextPage: PropTypes.number.isRequired,
  isLast: PropTypes.bool.isRequired,
};

export default Pagination;
