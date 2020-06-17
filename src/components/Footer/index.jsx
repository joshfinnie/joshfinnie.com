/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import './footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p className="copyright text-muted">
        &copy; 2010 - {year}.
        <a
          rel="license"
          href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
        >
          <img
            alt="Creative Commons License"
            className="cc-img"
            src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png"
          />
        </a>
      </p>
    </footer>
  );
};

export default Footer;
