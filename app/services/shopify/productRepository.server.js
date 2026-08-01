
async function getAllProducts(admin) {
  return getProductsByQuery(admin, "");
}

async function getProductsByTag(admin, tag) {
  return getProductsByQuery(admin, `tag:${JSON.stringify(tag)}`);
}

async function getProductsByCollection(admin, collectionId) {
  const response = await admin.graphql(
    `#graphql
    query CollectionProducts($id: ID!) {
      collection(id: $id) {
        products(first: 50) {
          nodes {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }`,
    {
      variables: {
        id: collectionId,
      },
    },
  );

  const payload = await response.json();

  return payload.data?.collection?.products?.nodes ?? [];
}

async function getProductsByQuery(admin, query) {
  const response = await admin.graphql(
    `#graphql
    query Products($query: String) {
      products(first: 50, query: $query) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
        }
      }
    }`,
    {
      variables: {
        query,
      },
    },
  );

  const payload = await response.json();

  return payload.data?.products?.nodes ?? [];
}

