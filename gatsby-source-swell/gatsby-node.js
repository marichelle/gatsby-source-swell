const { createRemoteFileNode } = require('gatsby-source-filesystem')
const swell = require('swell-node')
const { NODE_PREFIX, NODE_TYPES } = require('./constants')

exports.sourceNodes = async (
  { actions: { createNode }, createContentDigest, createNodeId, reporter },
  { storeId, secretKey, dataTypes }
) => {
  if (!storeId || !secretKey) {
    return reporter.panic(
      'gatsby-source-swell: You must provide your Swell store credentials'
    )
  }

  swell.init(storeId, secretKey, {
    useCamelCase: true,
  })

  // determine Swell data types to fetch
  dataTypes =
    dataTypes !== undefined && dataTypes.length
      ? dataTypes
      : ['category', 'product']
  dataTypes = NODE_TYPES.filter(type => dataTypes.includes(type.label))

  await Promise.all(
    dataTypes.map(async dataType => {
      // fetch data via API call
      const response = await swell.get(dataType.endpoint, dataType.arguments)

      if (response.results.length) {
        reporter.info(`starting to fetch ${dataType.label} data from Swell`)

        // create a node for each object
        response.results.forEach(obj => {
          let nodeData = {
            // Data for the node.
            ...obj,
            [`${dataType.label}_id`]: obj.id,

            // Required fields.
            id: createNodeId(obj.id),
            internal: {
              type: NODE_PREFIX + dataType.type,
              content: JSON.stringify(obj),
              contentDigest: createContentDigest(obj),
            },
          }

          // add foreign-key relationship for bundle products and product categories
          if (dataType.label === 'product') {
            nodeData = {
              ...nodeData,
              [`bundle_products___NODE`]: obj.bundle_items
                ? obj.bundle_items.map(item => createNodeId(item.product_id))
                : [],
              [`categories___NODE`]: obj.category_index.id
                ? obj.category_index.id.map(id => createNodeId(id))
                : [],
            }
          }

          createNode(nodeData)
        })

        reporter.info(`finished fetching ${dataType.label} data from Swell`)
      } else {
        reporter.info(`no ${dataType.label} data available to fetch from Swell`)
      }
    })
  )
}

exports.onCreateNode = async ({
  actions: { createNode, createNodeField },
  createNodeId,
  getCache,
  node,
}) => {
  if (node.internal.type === 'SwellProduct') {
    // download images and create File nodes accordingly
    if (node.images.length > 0) {
      const images = await Promise.all(
        node.images.map(el =>
          createRemoteFileNode({
            createNode,
            createNodeId,
            getCache,
            parentNodeId: node.id,
            url: el.file.url, // The source url of the remote file
          })
        )
      )

      // link File nodes to image nodes
      node.images.forEach((image, i) => {
        image.fileLocal___NODE = images[i].id
      })
    }

    // create custom field for product categories
    if (node.category_index.id.length > 0) {
      const categories = await Promise.all(
        node.category_index.id.map(
          async categoryId =>
            await swell.get('/categories/{id}', {
              id: categoryId,
            })
        )
      )

      createNodeField({
        node,
        name: 'categories',
        value: categories || [],
      })
    }
  }
}
