/* eslint-disable react/self-closing-comp */
import React from 'react';

import './header.css';
import config from '../../utils/config';

const Header = () => (
  <div className="container header">
    <header className="blog-header">
      <div className="row flex-nowrap justify-content-between align-items-center">
        <div className="col-8">
          <a className="blog-header-logo text-dark" href="/">{config.title}</a>
        </div>
        <div className="col-4 pt-4">
          <ul className="list-inline text-center">
            <li className="list-inline-item">
              <a href="https://twitter.com/joshfinnie" className="twitter">
                <span className="fa-stack fa-lg">
                  <i className="fas fa-circle fa-stack-2x"></i>
                  <i className="fab fa-twitter fa-stack-1x fa-inverse"></i>
                </span>
              </a>
            </li>
            <li className="list-inline-item">
              <a href="https://github.com/joshfinnie" className="github">
                <span className="fa-stack fa-lg">
                  <i className="fas fa-circle fa-stack-2x"></i>
                  <i className="fab fa-github fa-stack-1x fa-inverse"></i>
                </span>
              </a>
            </li>
            <li className="list-inline-item">
              <a href="https://linkedin.com/in/joshfinnie" className="linkedin">
                <span className="fa-stack fa-lg">
                  <i className="fas fa-circle fa-stack-2x"></i>
                  <i className="fab fa-linkedin fa-stack-1x fa-inverse"></i>
                </span>
              </a>
            </li>
            <li className="list-inline-item">
              <a href="https://instagram.com/joshfinnie" className="instagram">
                <span className="fa-stack fa-lg">
                  <i className="fas fa-circle fa-stack-2x"></i>
                  <i className="fab fa-instagram fa-stack-1x fa-inverse"></i>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  </div>
);

export default Header;
