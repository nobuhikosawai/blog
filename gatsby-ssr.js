import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      dangerouslySetInnerHTML={{
        __html: `
          // Darkmode work with:
          // - https://github.com/GoogleChromeLabs/dark-mode-toggle
          // - https://github.com/postcss/postcss-dark-theme-class

          const __isDarkThemeSupported = () => {
            return window.matchMedia("(prefers-color-scheme)").media !== "not all"
          }

          const __updateTheme = (theme) => {
            const html = document.documentElement;
            if (theme === 'light') {
              html.classList.add('is-light');
              html.classList.remove('is-dark');
            } else if (theme === 'dark') {
              html.classList.add('is-dark');
              html.classList.remove('is-light');
            }
          };

          // This is a hack to fix dark mode flash when the user preferred thteme is already set.
          window.addEventListener('DOMContentLoaded', () => {
            if (__isDarkThemeSupported()) {
              const preferredTheme = localStorage.getItem('dark-mode-toggle');
              __updateTheme(preferredTheme);
            }
          })

          window.addEventListener('colorschemechange', (event) => {
            const theme = event.detail.colorScheme;
            __updateTheme(theme);
          });
        `
    }}
    />,
  ])
};
