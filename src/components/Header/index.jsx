/* eslint-disable react/self-closing-comp */
import React from 'react';

import logo from './logo.png';

const Header = () => (
  <header>
    <a href="/" className="title">
      <img src={logo} alt="joshfinnie" />
    </a>
    <span className="button-wrapper">
      <a href="https://twitter.com/joshfinnie" className="twitter">
        <span className="fa-stack fa-lg">
          <i className="fas fa-circle fa-stack-2x" />
          <i className="fab fa-twitter fa-stack-1x fa-inverse" />
        </span>
      </a>
      <a href="https://github.com/joshfinnie" className="github">
        <span className="fa-stack fa-lg">
          <i className="fas fa-circle fa-stack-2x" />
          <i className="fab fa-github fa-stack-1x fa-inverse" />
        </span>
      </a>
      <a href="https://linkedin.com/in/joshfinnie" className="linkedin">
        <span className="fa-stack fa-lg">
          <i className="fas fa-circle fa-stack-2x" />
          <i className="fab fa-linkedin fa-stack-1x fa-inverse" />
        </span>
      </a>
      <a href="https://instagram.com/joshfinnie" className="instagram">
        <span className="fa-stack fa-lg">
          <i className="fas fa-circle fa-stack-2x" />
          <i className="fab fa-instagram fa-stack-1x fa-inverse" />
        </span>
      </a>
    </span>
  </header>
);

export default Header;
