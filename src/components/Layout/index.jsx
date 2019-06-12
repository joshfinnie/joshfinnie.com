import React from 'react';
import PropTypes from 'prop-types';

import Footer from '../Footer';
import Header from '../Header';
import NavBar from '../NavBar';

const Layout = ({children}) => (
  <div className="container">
    <Header />
    <NavBar />
    {children}
    <Footer />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
