// app/services/shopifyProductResolver.server.js

export async function resolveStepProducts(admin, step) {
  if (step.sourceType === "ALL_PRODUCTS") {
    return getProductsByQuery(admin, "");
  }

  if (step.sourceType === "TAG") {
    return getProductsByQuery(admin, `tag:${step.sourceValue}`);
  }

  if (step.sourceType === "COLLECTION") {
    return getProductsByCollection(admin, step.sourceValue);
  }

  if (step.sourceType === "CUSTOM_PRODUCTS") {
    return step.products ?? [];
  }

  return [];
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
          }
        }
      }
    }`,
    { variables: { query } },
  );

  const json = await response.json();

  return json.data.products.nodes.map((product) => ({
    productId: product.id,
    title: product.title,
    handle: product.handle,
    image: product.featuredImage?.url ?? null,
  }));
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
            }
          }
        }
      }
    }`,
    { variables: { id: collectionId } },
  );

  const json = await response.json();

  return json.data.collection.products.nodes.map((product) => ({
    productId: product.id,
    title: product.title,
    handle: product.handle,
    image: product.featuredImage?.url ?? null,
  }));
}