import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import Footer from '../Footer';
import Header from '../Header';
import NavBar from '../NavBar';
import config from '../../utils/config';

import './prism.css';
import './layout.css';

const Layout = ({ children }) => (
  <React.Fragment>
    <Helmet
      title={config.title}
      meta={[
        { name: 'description', content: config.description },
        { name: 'keywords', content: config.keywords },
      ]}
    >
      <html lang="en" />
    </Helmet>
    <div className="sticky-top header">
      <Header />
      <NavBar />
    </div>
    <main role="main" className="container">
      {children}
    </main>
    <Footer />
  </React.Fragment>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
