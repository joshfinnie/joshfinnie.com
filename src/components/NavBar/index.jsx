import React from 'react';

import './navbar.css';

const NavBar = () => (
  <div className="container">
    <div className="nav-scroller py-1 mb-2">
      <nav className="nav d-flex justify-content-center">
        <a className="p-2 text-muted" href="/">
          Home
        </a>
        <a className="p-2 text-muted" href="/about">
          About
        </a>
        <a className="p-2 text-muted" href="/talks">
          Talks
        </a>
      </nav>
    </div>
  </div>
);

export default NavBar;
