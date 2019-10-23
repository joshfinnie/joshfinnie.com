/* eslint-disable react/self-closing-comp */
import React from 'react';

import styles from './header.module.css';

const Header = () => (
  <header>
    <a href="/" className={styles.title}>
        <h1>joshfinnie</h1>
    </a>
    <span className="button-wrapper">
      <a href="https://twitter.com/joshfinnie" className={styles.twitter} target="_blank">
        <span className="fa-stack fa-lg">
          <i className="fas fa-circle fa-stack-2x" />
          <i className="fab fa-twitter fa-stack-1x fa-inverse" />
        </span>
      </a>
      <a href="https://github.com/joshfinnie" className={styles.github} target="_blank">
        <span className="fa-stack fa-lg">
          <i className="fas fa-circle fa-stack-2x" />
          <i className="fab fa-github fa-stack-1x fa-inverse" />
        </span>
      </a>
      <a href="https://linkedin.com/in/joshfinnie" className={styles.linkedin} target="_blank">
        <span className="fa-stack fa-lg">
          <i className="fas fa-circle fa-stack-2x" />
          <i className="fab fa-linkedin fa-stack-1x fa-inverse" />
        </span>
      </a>
      <a href="https://instagram.com/joshfinnie" className={styles.instagram} target="_blank">
        <span className="fa-stack fa-lg">
          <i className="fas fa-circle fa-stack-2x" />
          <i className="fab fa-instagram fa-stack-1x fa-inverse" />
        </span>
      </a>
    </span>
  </header>
);

export default Header;
