import React from 'react';

import PropTypes from 'prop-types';
import {Link} from 'gatsby';

import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';

import styles from './post.module.css';
import img1 from './img1.jpg';
import img2 from './img2.jpg';
import img3 from './img3.jpg';
import img4 from './img4.jpg';
import img5 from './img5.jpg';
import img6 from './img6.jpg';

const PostLink = ({post}) => {
  const imgURL = get(post.frontmatter, 'image.publicURL');
  const imgArray = [
    <img src={img1} className="round-img" alt={post.frontmatter.title} />,
    <img src={img2} className="round-img" alt={post.frontmatter.title} />,
    <img src={img3} className="round-img" alt={post.frontmatter.title} />,
    <img src={img4} className="round-img" alt={post.frontmatter.title} />,
    <img src={img5} className="round-img" alt={post.frontmatter.title} />,
    <img src={img6} className="round-img" alt={post.frontmatter.title} />,
  ];
  return (
    <div className={styles.post}>
      {imgURL ? (
        <img src={imgURL} className="round-img" alt={post.frontmatter.title} />
      ) : (
        imgArray[Math.floor(Math.random() * 6)]
      )}
      <span className="info">
        <h1>{post.frontmatter.title}</h1>
        <p>
          <i className="fas fa-calendar-alt inline-icon" />
          {post.frontmatter.date}
        </p>
        <p>
          <i className="fas fa-tags inline-icon" />
          {post.frontmatter.tags.map((tag, i) => {
            const lastIndex = post.frontmatter.tags.length - 1;
            return (
              <span key={tag} className="tag">
                <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                {i === lastIndex ? '' : ', '}
              </span>
            );
          })}
        </p>
        <Link to={post.frontmatter.path}>
          <button type="submit" className={styles.button}>
            READ MORE...
          </button>
        </Link>
      </span>
    </div>
  );
};

PostLink.propTypes = {
  post: PropTypes.shape({
    frontmatter: PropTypes.shape({
      path: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      image: PropTypes.shape({
        publicURL: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default PostLink;
