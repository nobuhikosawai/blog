import { Link } from 'gatsby';
import { css } from '@emotion/react';
import { rhythm, scale } from '../utils/typography'

export const LanguageSelector = ({ pathname }) => {
  const wrapper = css`
    margin: 0;
    display: flex;
    align-items: center;
    @media (max-width: 1024px) {
      display: block;
      text-align: center;
    }
  `
  const listItem = css`
    list-style: none;
    margin: 0;
    padding: 0;
    :not(:last-child) {
      margin-right: ${rhythm(0.2)};
    }
    width: 100 %;
    box-sizing: border - box;
    @media(max-width: 1024px) {
      :not(:last-child) {
        margin-right: 0;
        margin-bottom: ${rhythm(0.1)};
      }
    }
  `;
  const languageItem = css`
    display: block;
    box-sizing: border-box;
    padding: 0 ${rhythm(0.2)};
    font-size: ${scale(0.1).fontSize};
    font-weight: bold;
    color: var(--color-btn-text-outlined);
    box-shadow: none;
    border: 1px solid var(--color-border-overlay);
    border-radius: ${rhythm(1)};
    :hover {
      background: var(--color-btn-bg-outlined-active);
    }
    @media (max-width: 1024px) {
      font-size: ${scale(0.01).fontSize};
    }
  `;
  const languageItemSelected = css`
    background: var(--color-btn-bg);
    color: var(--color-btn-text);
    :hover {
      background: var(--color-btn-bg-active);
    }
  `
  const isJa = pathname.match(/\/ja$|\/ja\//)
  const isEn = pathname.match(/\/en$|\/en\//)

  return (
    <ul css={wrapper}>
      <li css={listItem}>
        <Link to="/ja" css={[languageItem, isJa ? languageItemSelected : undefined]}><small>日本語</small></Link>
      </li>
      <li css={listItem}><Link to="/en" css={[languageItem, isEn ? languageItemSelected : undefined]}><small>English</small></Link></li>
    </ul >
  );
}
