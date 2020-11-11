require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: 'gatsby-source-swell',
      options: {
        storeId: process.env.SWELL_STORE_ID,
        secretKey: process.env.SWELL_SECRET_KEY,
      },
    },
  ],
}
