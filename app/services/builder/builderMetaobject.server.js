const BUILDER_METAOBJECT_TYPE = "$app:build_a_box_builder";

const UPSERT_BUILDER_METAOBJECT = `#graphql
  mutation UpsertBuilderMetaobject(
    $handle: MetaobjectHandleInput!
    $metaobject: MetaobjectUpsertInput!
  ) {
    metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
      metaobject {
        id
        handle
        type
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export async function syncBuilderMetaobject({ admin, builder }) {
  if (!admin) {
    throw new Error("Admin GraphQL client is required");
  }

  if (!builder?.id) {
    throw new Error("Builder ID is required");
  }

  const fields = [
    {
      key: "name",
      value: builder.name || "Untitled builder",
    },
    {
      key: "builder_id",
      value: builder.id,
    },
    {
      key: "status",
      value: builder.status || "draft",
    },
  ];

  /*
   * file_reference fields require a Shopify file/media GID,
   * not an image URL. Leave thumbnail out until we confirm
   * builder.productImage is a Shopify GID.
   */
  if (builder.thumbnailGid) {
    fields.push({
      key: "thumbnail",
      value: builder.thumbnailGid,
    });
  }

  const response = await admin.graphql(UPSERT_BUILDER_METAOBJECT, {
    variables: {
      handle: {
        type: BUILDER_METAOBJECT_TYPE,
        handle: `builder-${builder.id}`,
      },
      metaobject: {
        fields,
      },
    },
  });

  const json = await response.json();
  const payload = json.data?.metaobjectUpsert;

  if (!payload) {
    throw new Error(
      json.errors?.map((error) => error.message).join(", ") ||
        "Shopify returned no metaobjectUpsert payload",
    );
  }

  if (payload.userErrors.length > 0) {
    throw new Error(
      payload.userErrors
        .map((error) => `${error.field?.join(".") || "metaobject"}: ${error.message}`)
        .join(", "),
    );
  }

  return payload.metaobject;
}