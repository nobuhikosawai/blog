import React from 'react';
import { Link } from 'gatsby';
import { css } from '@emotion/core';
import { scale, rhythm } from '../utils/typography';

const root = css`
  padding: 20px;
`;

const titleScale = scale(.25);

const title = css`
  font-family: Montserrat, sans-serif;
  font-size: ${titleScale.fontSize};
  line-height: ${titleScale.lineHeight};
  margin: 0 0 ${rhythm(0.25)} 0;
`;

const tocList = css`
  position: relative;
  padding-left: 20px;
  &::before {
    position: absolute;
    content: "";
    left: 5px;
    border-radius: 4px;
    width: 2px;
    background: lightgray;
    top: 12px;
    bottom: 12px;
  }
`;

const listStyle = css`
  list-style: none;
  margin: 0;
`;

const tocItem = css`
  margin: 0;
  position: relative;
  &::before {
    position: absolute;
    content: "";
    left: -20px;
    top: 8px;
    border-radius: 50px;
    border: 2px white solid;
    width: 12px;
    height: 12px;
    background: gray;
  }
`
const tocItemSecond = css`
  margin: 0;
  position: relative;
  &::before {
    position: absolute;
    content: "";
    left: -18px;
    top: 10px;
    border-radius: 50px;
    border-radius: 50px;
    border: 2px white solid;
    width: 8px;
    height: 8px;
    background: gray;
  }
`
const tocItemLink = css`
  box-shadow: none; 
`;

const Toc = (props) => {
  const { tableOfContents } = props;
  const { items } = tableOfContents;
  
  if (!items) { return null; }

  return(
    <nav css={root}>
      <h2 css={title}>Contents</h2>
      <div css={tocList}>
        <ol css={listStyle}>
          {items.map(item => {
            const { url, title, items } = item;

            return (
              <li key={url} css={tocItem}>
                <Link to={url} css={tocItemLink}>
                  {title}
                </Link>
                <ol css={listStyle}>
                  { items && 
                      items.map(item => {
                        const { url, title } = item;
                        return (
                          <li key={url} css={tocItemSecond}>
                            <Link to={url} css={tocItemLink}>
                              {title}
                            </Link>
                          </li>
                        );
                      })
                  }
                </ol>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export default Toc;
