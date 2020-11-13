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
          createNode({
            ...obj,
            id: createNodeId(obj.id),
            internal: {
              type: NODE_PREFIX + dataType.type,
              content: JSON.stringify(obj),
              contentDigest: createContentDigest(obj),
            },
          })
        })

        reporter.info(`finished fetching ${dataType.label} data from Swell`)
      } else {
        reporter.info(`no ${dataType.label} data available to fetch from Swell`)
      }
    })
  )
}

exports.onCreateNode = async ({
  actions: { createNode },
  store,
  node,
  cache,
  createNodeId,
}) => {
  if (node.internal.type === 'SwellProduct' && node.images.length > 0) {
    const images = await Promise.all(
      // download images and create File nodes accordingly
      node.images.map(el =>
        createRemoteFileNode({
          store,
          cache,
          createNode,
          createNodeId,
          parentNodeId: node.id,
          url: el.file.url,
        })
      )
    )

    // link File nodes to image nodes
    node.images.forEach((image, i) => {
      image.fileLocal___NODE = images[i].id
    })
  }
}
