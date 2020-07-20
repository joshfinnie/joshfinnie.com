import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';

const Pagination = ({
  isFirst,
  prevPage,
  numPages,
  currentPage,
  nextPage,
  isLast,
}) => (
  <ul
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      listStyle: 'none',
      padding: 0,
    }}
  >
    {!isFirst && (
      <li>
        <Link to="/" rel="prev">
          <button>←←</button>
        </Link>
        <Link to={prevPage} rel="prev">
          <button>←</button>
        </Link>
      </li>
    )}
    {Array.from({length: numPages}, (_, i) => (
      <li
        key={`pagination-number${i + 1}`}
        style={{
          margin: 0,
        }}
      >
        {i === 0 ? (
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: i + 1 === currentPage ? '#ffffff' : '',
              background: i + 1 === currentPage ? '#007acc' : '',
            }}
          >
            <button>1</button>
          </Link>
        ) : (
          <Link
            to={`/blog/${i === 0 ? '' : i + 1}`}
            style={{
              textDecoration: 'none',
              color: i + 1 === currentPage ? '#ffffff' : '',
              background: i + 1 === currentPage ? '#007acc' : '',
            }}
          >
            <button>{i + 1}</button>
          </Link>
        )}
      </li>
    ))}
    {!isLast && (
      <li>
        <Link to={nextPage} rel="next">
          <button>→</button>
        </Link>
        <Link to={`/blog/${numPages}`} rel="next">
          <button>→→</button>
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
