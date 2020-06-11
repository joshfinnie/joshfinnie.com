/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

import Layout from '../components/Layout';
import SEO from '../components/SEO';

const StylePage = () => (
  <Layout>
    <SEO title="Style Guide" />
    <div className="main-div">
      <span className="style-data">
        <h1>Style Guide</h1>
        <p>
          Based on <a href="https://www.bryanbraun.com/">Bryan Braun’s</a>{' '}
          excellent{' '}
          <a href="https://www.poormansstyleguide.com/">
            Poor Man’s Styleguide
          </a>
        </p>

        <hr />
      </span>
      <span className="global-data">
        <h1 id="headings">Headings</h1>

        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>

        <hr />

        <h1 id="headings-with-text">Headings with Text</h1>

        <h1>Heading 1</h1>
        <p>
          Lorem ipsum dolor sit amet, adipiscing elit. Nullam dignissim
          convallis est. Quisque aliquam. Donec faucibus. Nunc iaculis suscipit
          dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt
          nec, gravida vehicula, nisl.
        </p>
        <h2>Heading 2</h2>
        <p>
          Lorem ipsum dolor sit amet, adipiscing elit. Nullam dignissim
          convallis est. Quisque aliquam. Donec faucibus. Nunc iaculis suscipit
          dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt
          nec, gravida vehicula, nisl.
        </p>
        <h3>Heading 3</h3>
        <p>
          Lorem ipsum dolor sit amet, adipiscing elit. Nullam dignissim
          convallis est. Quisque aliquam. Donec faucibus. Nunc iaculis suscipit
          dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt
          nec, gravida vehicula, nisl.
        </p>
        <h4>Heading 4</h4>
        <p>
          Lorem ipsum dolor sit amet, adipiscing elit. Nullam dignissim
          convallis est. Quisque aliquam. Donec faucibus. Nunc iaculis suscipit
          dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt
          nec, gravida vehicula, nisl.
        </p>
        <h5>Heading 5</h5>
        <p>
          Lorem ipsum dolor sit amet, adipiscing elit. Nullam dignissim
          convallis est. Quisque aliquam. Donec faucibus. Nunc iaculis suscipit
          dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt
          nec, gravida vehicula, nisl.
        </p>
        <h6>Heading 6</h6>
        <p>
          Lorem ipsum dolor sit amet, adipiscing elit. Nullam dignissim
          convallis est. Quisque aliquam. Donec faucibus. Nunc iaculis suscipit
          dui. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt
          nec, gravida vehicula, nisl.
        </p>

        <hr />

        <h1 id="text-block">Block Elements</h1>

        <h2 id="paragraph">Paragraphs and Images</h2>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Aliquam libero nisi, imperdiet at, tincidunt nec, gravida vehicula,
          nisl. Praesent mattis, massa quis luctus fermentum, turpis mi volutpat
          justo, eu volutpat enim diam eget metus. Maecenas ornare tortor.
        </p>

        <p>
          <img
            alt="Placeholder Image and Some Alt Text"
            src="https://placehold.it/350x150"
            title="A title element for this placeholder image."
          />
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam
          dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc iaculis
          suscipit dui. Nam sit amet sem.
        </p>

        <h2 id="blockquote">Blockquote</h2>

        <p>
          This is a standard paragraph. Lorem ipsum dolor sit amet, consectetuer
          adipiscing elit.
        </p>
        <blockquote>
          <p>
            "<strong>This is a blockquote.</strong> Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit. Nullam dignissim convallis est.
            Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit
            amet sem. Aliquam libero nisi, imperdiet at, tincidunt nec, gravida
            vehicula, nisl."
          </p>
        </blockquote>
        <p>
          This is a standard paragraph. Lorem ipsum dolor sit amet, consectetuer
          adipiscing elit.
        </p>

        <h2 id="figure-caption">Figure-Caption</h2>

        <figure>
          <img
            src="https://placehold.it/350x150"
            alt="A placeholder figure image."
          />
          <figcaption>The figcaption element example</figcaption>
        </figure>

        <h2 id="details-summary">Details-Summary</h2>

        <details>
          <summary>The summary element example</summary>
          <p>
            The details example text. It may be styled differently based on what
            browser or operating system you are using.
          </p>
        </details>

        <hr />

        <h1 id="text-elements"> Text Elements</h1>

        <p>
          The <a href="#">a element</a> and{' '}
          <a href="https://example.com" target="_blank">
            external a element
          </a>{' '}
          examples
        </p>
        <p>
          The <abbr>abbr element</abbr> and an{' '}
          <abbr title="Abbreviation">abbr</abbr> element with title examples
        </p>
        <p>
          The{' '}
          <acronym title="A Cowboy Ran One New York Marathon">ACRONYM</acronym>{' '}
          element example
        </p>
        <p>
          The <b>b element</b> example
        </p>
        <p>
          The <cite>cite element</cite> example
        </p>
        <p>
          The <code>code element</code> example
        </p>
        <p>
          The <data value="3967381398">data element</data> example
        </p>
        <p>
          The <del>del element</del> example
        </p>
        <p>
          The <dfn>dfn element</dfn> and{' '}
          <dfn title="Title text">dfn element with title</dfn> examples
        </p>
        <p>
          The <em>em element</em> example
        </p>
        <p>
          The <i>i element</i> example
        </p>
        <p>
          The <ins>ins element</ins> example
        </p>
        <p>
          The <kbd>kbd element</kbd> example
        </p>
        <p>
          The <mark>mark element</mark> example
        </p>
        <p>
          The <q>q element</q> example
        </p>
        <p>
          The{' '}
          <q>
            q element <q>inside</q> a q element
          </q>{' '}
          example
        </p>
        <p>
          The <s>s element</s> example
        </p>
        <p>
          The <samp>samp element</samp> example
        </p>
        <p>
          The <small>small element</small> example
        </p>
        <p>
          The <span>span element</span> example
        </p>
        <p>
          The <strong>strong element</strong> example
        </p>
        <p>
          The <sub>sub element</sub> example
        </p>
        <p>
          The <sup>sup element</sup> example
        </p>
        <p>
          The <time dateTime="2005-05-15 19:00">time element</time> example
        </p>
        <p>
          The <u>u element</u> example
        </p>
        <p>
          The <var>var element</var> example
        </p>

        <hr />

        <h1 id="monospace">Monospace / Preformatted</h1>
        <p>Code block wrapped in "pre" and "code" tags</p>
        <pre>
          <code>
            {`// Loop through Divs using Javascript.
        var divs = document.querySelectorAll('div'), i;

        for (i = 0; i < divs.length; ++i) {
          divs[i].style.color = "green";
        }`}
          </code>
        </pre>
        <p>Monospace Text wrapped in "pre" tags</p>
        <pre>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam
            dignissim convallis est. Quisque aliquam. Donec faucibus. Nunc
            iaculis suscipit dui. Nam sit amet sem. Aliquam libero nisi,
            imperdiet at, tincidunt nec, gravida vehicula, nisl.
          </p>
        </pre>

        <hr />

        <h1 id="list-types">List Types</h1>

        <h2 id="ordered-list">Ordered List</h2>
        <ol>
          <li>List Item 1</li>
          <li>List Item 2</li>
          <li>
            List Item 3
            <ol>
              <li>List Item 3.1</li>
              <li>
                List Item 3.2
                <ol>
                  <li>List Item 3.2.1</li>
                  <li>List Item 3.2.2</li>
                </ol>
              </li>
              <li>List Item 3.3</li>
            </ol>
          </li>
          <li>List Item 4</li>
        </ol>

        <h2 id="unordered-list">Unordered List</h2>
        <ul>
          <li>List Item 1</li>
          <li>List Item 2</li>
          <li>
            List Item 3
            <ul>
              <li>List Item 3.1</li>
              <li>
                List Item 3.2
                <ul>
                  <li>List Item 3.2.1</li>
                  <li>List Item 3.2.2</li>
                </ul>
              </li>
              <li>List Item 3.3</li>
            </ul>
          </li>
          <li>List Item 4</li>
        </ul>

        <h2 id="definition-list">Definition List</h2>
        <dl>
          <dt>Definition Term 1</dt>
          <dd>Definition Description 1</dd>
          <dt>Definition Term 2</dt>
          <dd>Definition Description 2</dd>
        </dl>

        <hr />

        <h1 id="tables">Tables</h1>

        <table cellSpacing="0" cellPadding="0">
          <caption>This is a table caption</caption>
          <thead>
            <tr>
              <th>Table Header 1</th>
              <th>Table Header 2</th>
              <th>Table Header 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Division 1</td>
              <td>Division 2</td>
              <td>Division 3</td>
            </tr>
            <tr className="even">
              <td>Division 1</td>
              <td>Division 2</td>
              <td>Division 3</td>
            </tr>
            <tr>
              <td>Division 1</td>
              <td>Division 2</td>
              <td>Division 3</td>
            </tr>
            <tr>
              <td colSpan="3">A row with a cell spanning all 3 columns</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>Table Footer 1</th>
              <th>Table Footer 2</th>
              <th>Table Footer 3</th>
            </tr>
          </tfoot>
        </table>
      </span>
    </div>
  </Layout>
);

export default StylePage;
