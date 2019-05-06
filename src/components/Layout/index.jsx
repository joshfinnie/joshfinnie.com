import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import Footer from '../Footer';
import Header from '../Header';
import NavBar from '../NavBar';
import config from '../../utils/config';

const Layout = ({children}) => (
  <>
    <Helmet
      title={config.title}
      meta={[
        {name: 'description', content: config.description},
        {name: 'keywords', content: config.keywords},
      ]}
    >
      <html lang="en" />
    </Helmet>
    <div className="container">
      <Header />
      <NavBar />
      <main role="main">{children}</main>
      <Footer />
    </div>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
