import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { StaticImage } from "gatsby-plugin-image";

import { rhythm } from '../utils/typography'

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <StaticImage
              src="../images/profile-pic.jpg"
              alt={author}
              formats={["AUTO", "WEBP", "AVIF"]}
              layout="fixed"
              width={50}
              height={50}
              quality={95}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `50%`,
              }} />
            <p>
              Personal blog by <a href={`https://twitter.com/${social.twitter}`}>{author}</a><br />
              who lives and works in Japan.
            </p>
          </div>
        );
      }}
    />
  );
}

const bioQuery = graphql`
  query BioQuery {
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio
