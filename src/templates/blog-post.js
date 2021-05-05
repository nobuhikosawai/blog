import React, { useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Link, graphql } from 'gatsby'
import { MDXRenderer } from "gatsby-plugin-mdx"
import { css } from '@emotion/react';

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import Toc from '../components/Toc';
import { rhythm, scale } from '../utils/typography'

const wrapper = css`
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 3fr 1fr;
    column-gap: 12px;
  }
`;

const navigation = css`
  display: none;
  @media (min-width: 1024px) {
    display: block;
    position: sticky;
    top: ${rhythm(7)};
  }
`;

const tocButton = css`
  display: block;
  position: relative;
  cursor: pointer;
  margin-bottom: ${rhythm(1)};
  border: none;
  border-radius: 4px;
  background: var(--color-btn-bg);
  padding: 4px 8px;
  color: var(--color-btn-text);
  @media (min-width: 1024px) {
    display: none;
  }
  &:hover, &:active{
    background: var(--color-btn-bg-active);
  }
`;

const tocModal = css`
  position: absolute;
  top: 100%;
  left: 20px;
  padding-top: 20px;
  z-index: 100;
`;

const tocModalContent = css`
  background-color: var(--color-bg-overlay);
  border: 1px solid var(--color-border-overlay);
  box-shadow: var(--dropdown-shadow);
  border-radius: 8px;
  max-width: 300px;
  min-width: 260px;
  text-align: left;
  &::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 8px;
    border: 8px solid transparent;
    border-bottom: 8px solid var(--color-border-overlay);
  }
  &::after {
    content: "";
    position: absolute;
    top: 7px;
    left: 9px;
    border: 7px solid transparent;
    border-bottom: 7px solid var(--color-bg-overlay);
  }
`;

const TocModal = (props) => {
  const { tableOfContents, closeFunc } = props;

  const isEventFromAnchorlink = (event) => {
    return event.target.tagName.toLowerCase() === 'a';
  }

  const overlay = css`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
    z-index: 1;
  `;

  return (
    <>
      <div css={overlay} onClick={(e) => { e.stopPropagation(); closeFunc() }} />
      <div css={tocModal} onClick={(e) => { e.stopPropagation(); isEventFromAnchorlink(e) && closeFunc(); }}>
        <div css={tocModalContent}>
          <Toc tableOfContents={tableOfContents} />
        </div>
      </div>
    </>
  );
}

const BlogPostTemplate = (props) => {
  const post = props.data.mdx
  const siteTitle = props.data.site.siteMetadata.title
  const { previous, next } = props.pageContext
  const { tableOfContents } = post;

  const hasTableOfContents = tableOfContents && Object.keys(tableOfContents).length > 0

  const tocButtonEl = useRef(null);
  const [displayToc, setDisplayToc] = useState(false);

  return (
    <div css={wrapper}>
      <Layout location={props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {post.frontmatter.date}
        </p>
        {
          hasTableOfContents &&
          <>
            <button css={tocButton} ref={tocButtonEl} onClick={() => setDisplayToc(!displayToc)}>
              目次
            </button>
            { displayToc &&
                ReactDOM.createPortal(
                  <TocModal tableOfContents={post.tableOfContents} closeFunc={() => setDisplayToc(false)} />,
                  tocButtonEl.current,
                )
            }
          </>
        }
        <MDXRenderer>{post.body}</MDXRenderer>
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />

        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
      <aside>
        <div css={navigation}>
          <Toc tableOfContents={tableOfContents} />
        </div>
      </aside>
    </div>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      tableOfContents(maxDepth: 2)
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
