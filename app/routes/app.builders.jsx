import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

import { getBuilders } from "../services/builder.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);

  const builders = await getBuilders(session.shop);

  return {
    builders,
  };
}

export default function BuildersIndex() {
  const { builders } = useLoaderData();

  return (
    <s-page heading="Builders">
      <s-button href="/app/builders/new" slot="primary-action">
        Create builder
      </s-button>

      <s-section>
        {builders.length === 0 ? (
          <s-stack gap="base">
            <s-text>No builders yet.</s-text>
            <s-text color="subdued">
              Create your first builder to start building product box flows.
            </s-text>
          </s-stack>
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
                <s-stack gap="small-100">
                  <s-text variant="headingMd">{builder.name}</s-text>
                  <s-text color="subdued">
                    Status: {builder.status}
                  </s-text>
                </s-stack>
              </s-clickable>
            ))}
          </s-stack>
        )}
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};