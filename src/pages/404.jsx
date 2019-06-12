import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const NotFoundPage = () => (
  <Layout>
    <SEO title="404 Page" />
    <div className="four-o-four-data">
      <h1 className="text-center">NOT FOUND</h1>
      <p>The page you are looking for has not been found.</p>
    </div>
  </Layout>
);

export default NotFoundPage;
