# gatsby-source-swell

This source plugin connects [Gatsby](https://www.gatsbyjs.com/) to [Swell's](https://www.swell.is/) [Node API](https://swell.store/docs/api/), which gives you access to the store data (categories, products, etc.) necessary to build an e-commerce storefront.

## Features

- Provides public shop data available via the [Swell API](https://swell.store/docs/api/)
  - Categories
  - Products
  - Product Attributes
  - Product Variants
  - Coupons
  - Promotions
- Supports `gatsby-transformer-sharp` and `gatsby-image` for product images

## Install

```shell
yarn add gatsby-source-swell
```

## How to use

In your `gatsby-config.js` add the following config to enable this plugin:

```js
plugins: [
  /*
   * Gatsby's data processing layer begins with “source”
   * plugins. Here the site sources its data from Swell.
   * The client uses your store ID and secret key for
   * authorization. You can find these in your
   * Dashboard under Settings > API.
   */
  {
    resolve: 'gatsby-source-swell',
    options: {
      // The domain name of your Swell store. This is required.
      storeId: 'swell-store-id',
      // The key used to access your data by API. This is required.
      secretKey: 'swellStoreSecretKey',
      // List of data types you want to fetch.
      // Defaults to ['category', 'product'].
      dataTypes: [
        'category',
        'product',
        'atttribute',
        'variant',
        'coupon',
        'promotion',
      ],
    },
  },
]
```
