import React from 'react'
import { Link, graphql } from 'gatsby'
import { MDXRenderer } from "gatsby-plugin-mdx"
import { css } from '@emotion/core';

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

const BlogPostTemplate = (props) => {
  const post = props.data.mdx
  const siteTitle = props.data.site.siteMetadata.title
  const { previous, next } = props.pageContext

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
          <Toc tableOfContents={post.tableOfContents} />
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
