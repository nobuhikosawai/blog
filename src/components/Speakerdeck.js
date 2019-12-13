import React from 'react';
import { css } from '@emotion/core';

const root = css`
  width: 100%;
  padding-top: 57%;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 1.75rem;
`;

const speakerdeckStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  border: 0;
  background: transparent;
  margin: 0;
  padding: 0;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px;
  width: 100%;
  height: 100%;
`;

export const Speakerdeck = (props) => {
  const { src } = props;
  return (
    <div css={root}>
      <iframe
        css={speakerdeckStyle}
        src={src}
        allow={'fullscreen'}
      />
    </div>
  );
};
