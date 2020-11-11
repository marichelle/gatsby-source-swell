// Node prefix
module.exports.NODE_PREFIX = `Swell`

// Node types
module.exports.NODE_TYPES = [
  {
    type: 'Category',
    label: 'category',
    endpoint: '/categories',
    arguments: {},
  },
  {
    type: 'Product',
    label: 'product',
    endpoint: '/products',
    arguments: {},
  },
  {
    type: 'ProductAttribute',
    label: 'attribute',
    endpoint: '/attributes',
    arguments: {},
  },
  {
    type: 'ProductVariant',
    label: 'variant',
    endpoint: '/products:variants',
    arguments: {},
  },
  {
    type: 'StoreCoupon',
    label: 'coupon',
    endpoint: '/coupons',
    arguments: {
      where: {
        active: true,
      },
    },
  },
  {
    type: 'StorePromotion',
    label: 'promotion',
    endpoint: '/promotions',
    arguments: {
      where: {
        active: true,
      },
    },
  },
]
