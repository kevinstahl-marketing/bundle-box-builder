import { authenticate } from "../shopify.server";
export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    #graphql
    query Collections {
      collections(first: 50, sortKey: TITLE) {
        nodes {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  `);

  const payload = await response.json();

  return Response.json({
    collections: payload.data.collections.nodes,
  });
}