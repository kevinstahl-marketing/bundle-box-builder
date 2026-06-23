import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

import { getBuilders } from "../services/builder.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);

  const builders = await getBuilders(session.shop);

  return { builders };
}

export default function BuildersIndex() {
  const { builders } = useLoaderData();

  return (
    <s-page heading="Builders">
      <s-button href="/app/builders/new" slot="primary-action">
        Create builder
      </s-button>

      <s-section heading="Your builders">
        {builders.length === 0 ? (
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-stack gap="small">
              <s-heading>No builders yet</s-heading>
              <s-text color="subdued">
                Create your first build-a-box flow. You’ll add products, rules,
                progress steps, and storefront settings from the builder editor.
              </s-text>
              <s-button href="/app/builders/new">Create builder</s-button>
            </s-stack>
          </s-box>
        ) : (
          <s-stack gap="base">
            {builders.map((builder) => (
              <s-clickable
                key={builder.id}
                href={`/app/builders/${builder.id}`}
                border="base"
                borderRadius="base"
                padding="base"
              >
                <s-stack gap="small">
                  <s-heading>{builder.name}</s-heading>

                  <s-text color="subdued">
                    Status: {builder.status ?? "draft"}
                  </s-text>

                  <s-text color="subdued">
                    Click to edit this builder.
                  </s-text>
                </s-stack>
              </s-clickable>
            ))}
          </s-stack>
        )}
      </s-section>

      <s-section slot="aside" heading="Builder flow">
        <s-unordered-list>
          <s-list-item>Create builder</s-list-item>
          <s-list-item>Add selectable products</s-list-item>
          <s-list-item>Set min/max rules</s-list-item>
          <s-list-item>Style progress/loading UI</s-list-item>
          <s-list-item>Publish to storefront</s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};