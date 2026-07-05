import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    #graphql
    query ProductVendors {
      shop {
        productVendors(first: 100) {
          nodes
        }
      }
    }
  `);

  const payload = await response.json();

  return json({
    vendors: payload.data.shop.productVendors.nodes,
  });
}