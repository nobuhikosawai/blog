import React from 'react'
import { Link } from 'gatsby'
import { css } from '@emotion/react';
import Loadable from "@loadable/component"
import { LanguageSelector } from './LanguageSelector';
// import DarkModeToggleButton from './DarkModeToggleButton';

import { rhythm, scale } from '../utils/typography'

const DarkModeToggleButton = Loadable(() => import('./DarkModeToggleButton'));

const headerLayout = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const head1 = css`
  font-size: ${scale(1).fontSize};
  line-hight: ${scale(1).lineHeight};
  margin: 0;
  @media (min-width: 1024px) {
    font-size: ${scale(1.5).fontSize};
    line-hight: ${scale(1.5).lineHeight};
  }
`;

const right = css`
  display: flex;
  align-items: center;
`
const language = css`
  margin-right: ${rhythm(0.2)};
  @media (max-width: 1024px) {
    margin-right: ${rhythm(0.1)};
  }
`

const Layout = (props) => {
  const { location, title, children } = props
  const rootPaths = [`${__PATH_PREFIX__}/`, `${__PATH_PREFIX__}/ja`, `${__PATH_PREFIX__}/en`]
  let header

  if (rootPaths.includes(location.pathname)) {
    header = (
      <header css={headerLayout} style={{ marginBottom: rhythm(1) }}>
        <h1 css={head1}>
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
        <div css={right}>
          <div css={language} style={{ ...scale(1 / 10) }}>
            <LanguageSelector pathname={location.pathname} />
          </div>
          <DarkModeToggleButton />
        </div>
      </header>
    )
  } else {
    header = (
      <header css={headerLayout} style={{ marginBottom: rhythm(-1) }}>
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            margin: 0,
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
        <div css={right}>
          <div css={language} >
            <LanguageSelector pathname={location.pathname} />
          </div>
          <DarkModeToggleButton />
        </div>
      </header>
    )
  }

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      {header}
      {children}
      <footer>
        © 2018, Built with <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    </div>
  );
}

export default Layout
