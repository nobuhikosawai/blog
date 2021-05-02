import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.__isDarkThemeSupported = () => {
            return window.matchMedia("(prefers-color-scheme)").media !== "not all"
          }

          // If prefers-color-scheme is not supported, fall back to light mode.
          if (!window.__isDarkThemeSupported()) {
            document.documentElement.style.display = 'none';
            document.head.insertAdjacentHTML(
                'beforeend',
                '<link rel="stylesheet" href="light.css">'
            );
          }

          // Hack to fix dark mode flash when the user preferred thteme is already set.
          window.addEventListener('DOMContentLoaded', () => {
            if (window.__isDarkThemeSupported()) {
              const preferredTheme = localStorage.getItem('dark-mode-toggle');

              if (preferredTheme) {
                const lightEl = document.getElementById('light');
                const darkEl = document.getElementById('dark');

                if (preferredTheme === 'light') {
                  lightEl.disabled = false;
                  lightEl.media = 'all';
                  darkEl.disabled = true;
                  darkEl.media = 'not all'
                } else {
                  lightEl.disabled = true;
                  lightEl.media = 'not all';
                  darkEl.disabled = false;
                  darkEl.media = 'all'
                }
              }
            }
          })
        `
    }}
    />,
    <link id="dark" type="text/css" rel="stylesheet" href="/dark.css" media="(prefers-color-scheme: dark)" />,
    <link id='light'type="text/css" rel="stylesheet" href="/light.css" media="(prefers-color-scheme: light)" />,
  ])
};
