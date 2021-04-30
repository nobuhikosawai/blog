import React, { useEffect } from 'react'
import { Link } from 'gatsby'
import { css } from '@emotion/core';
import { Helmet } from 'react-helmet';

import { rhythm, scale } from '../utils/typography'

const headerLayout = css`
  display: flex;
  justify-content: space-between;
  & > dark-mode-toggle {
    padding-top: 1.25rem;
  }
`;

const Layout = (props) => {
  // import client-side because it depends on the `document` api.
  // https://github.com/gatsbyjs/gatsby/issues/16815#issuecomment-527901559
  useEffect(() => {
    import('dark-mode-toggle/src/dark-mode-toggle');
  }, []);

  const { location, title, children } = props
  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
          marginBottom: rhythm(-1),
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    )
  }

  return (
    <>
      <Helmet>
        <script>{`
          // If prefers-color-scheme is not supported, fall back to light mode.
          if (window.matchMedia('(prefers-color-scheme: dark)').media === 'not all') {
            document.documentElement.style.display = 'none';
            document.head.insertAdjacentHTML(
                'beforeend',
                '<link rel="stylesheet" href="light.css">'
            );
          }
        `}</script>
        <link rel="stylesheet" href="dark.css" media="(prefers-color-scheme: dark)" />
        <link rel="stylesheet" href="light.css" media="(prefers-color-scheme: light)" />
      </Helmet>

      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <header css={headerLayout}>
          {header}
          <dark-mode-toggle />
        </header>
        {children}
        <footer>
          © 2018, Built with <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    </>
  );
}

export default Layout
