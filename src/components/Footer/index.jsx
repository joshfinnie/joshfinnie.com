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
          href="http://creativecommons.org/licenses/by-nc-sa/3.0/">
          <img
            alt="Creative Commons License"
            src="https://i.creativecommons.org/l/by-nc-sa/3.0/80x15.png"
            className="cc-img"
          />
        </a>
      </p>
    </footer>
  );
};

export default Footer;
