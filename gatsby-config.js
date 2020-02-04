// eslint-disable-next-line no-undef
module.exports = {
  siteMetadata: {
    title: 'Med4Care',
    description: `Medical Software`,
    author: `Dominic Domingo`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        // eslint-disable-next-line no-undef
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Medical Software`,
        short_name: `medicalsw`,
        start_url: `/`,
        background_color: `#0A1930`,
        theme_color: `#0A1930`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`,
      },
    },
    `gatsby-plugin-transition-link`,
    `gatsby-plugin-modal-routing`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] },
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        color: `#4Caf50`,
        showSpinner: true,
      },
    },
  ],
}
