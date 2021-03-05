import React from 'react';

import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Talk from '../components/Talk';

import data from '../data/talks.json';

export default function About() {
  return (
    <Layout>
      <SEO title="Talks" />
      <div className="main-div">
        <h1 className="text-center">Talks</h1>
        <h4>
          (
          <i className="fa fa-bolt bolt inline-icon" aria-hidden="true" />
          denotes Lightning Talks)
        </h4>
        {data.talks
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map((talk) => (
            <Talk talk={talk} key={talk.name} />
          ))}
      </div>
    </Layout>
  );
}
