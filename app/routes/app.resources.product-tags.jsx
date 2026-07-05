import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query ProductTags {
      productTags(first: 250) {
        nodes
      }
    }`,
  );

  const payload = await response.json();

  return Response.json({
    tags: payload.data?.productTags?.nodes ?? [],
  });
}