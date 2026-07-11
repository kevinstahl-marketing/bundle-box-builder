const SET_BUILDER_PRODUCT_METAFIELD = `#graphql
  mutation SetBuilderProductMetafield(
    $metafields: [MetafieldsSetInput!]!
  ) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        value
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export async function syncBuilderProductMetafield({
  admin,
  productId,
  metaobjectId,
}) {
  if (!admin) {
    throw new Error("Admin GraphQL client is required");
  }

  if (!productId) {
    throw new Error("Shopify product ID is required");
  }

  if (!metaobjectId) {
    throw new Error("Builder metaobject ID is required");
  }

  const response = await admin.graphql(
    SET_BUILDER_PRODUCT_METAFIELD,
    {
      variables: {
        metafields: [
          {
            ownerId: productId,
            namespace: "$app",
            key: "build_a_box_builder",
            type: "metaobject_reference",
            value: metaobjectId,
          },
        ],
      },
    },
  );

  const json = await response.json();
  const payload = json.data?.metafieldsSet;

  if (!payload) {
    throw new Error(
      json.errors?.map((error) => error.message).join(", ") ||
        "Shopify returned no metafieldsSet payload",
    );
  }

  if (payload.userErrors.length > 0) {
    throw new Error(
      payload.userErrors
        .map(
          (error) =>
            `${error.field?.join(".") || "metafield"}: ${error.message}`,
        )
        .join(", "),
    );
  }

  return payload.metafields[0];
}