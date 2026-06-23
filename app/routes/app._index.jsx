import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";

import { Link } from "react-router";

import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { getBuilders } from "../services/builder.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const builders = await getBuilders(session.shop);

  const stats = {
    total: builders.length,
    active: builders.filter((builder) => builder.status === "active").length,
    draft: builders.filter((builder) => builder.status !== "active").length,
  };

  return { builders, stats };
}

export default function Index() {
  const { builders, stats } = useLoaderData();
  const recentBuilders = builders.slice(0, 5);

  return (
    <s-page heading="Build a Box">
      <s-button href="/app/builders/new" slot="primary-action">
        Create builder
      </s-button>

      <s-section heading="Dashboard">
        <s-paragraph>
          Manage your box builders, product selection flows, and storefront setup.
        </s-paragraph>

        <s-stack direction="inline" gap="base">
          <StatCard label="Total builders" value={stats.total} />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Drafts" value={stats.draft} />
        </s-stack>
      </s-section>

      <s-section heading="Recent builders">
        {recentBuilders.length === 0 ? (
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-stack gap="small">
              <s-heading>No builders yet</s-heading>
              <s-text color="subdued">
                Create your first builder to start setting up a build-a-box
                product flow.
              </s-text>
              <s-button href="/app/builders/new">Create builder</s-button>
            </s-stack>
          </s-box>
        ) : (
          <s-stack gap="base">
            {recentBuilders.map((builder) => (
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
                </s-stack>
              </s-clickable>
            ))}

            <s-button href="/app/builders" variant="secondary">
              View all builders
            </s-button>
          </s-stack>
        )}
      </s-section>

      <s-section slot="aside" heading="Quick actions">
        <s-stack gap="base">
          <s-button href="/app/builders/new">Create builder</s-button>
          <s-button href="/app/builders" variant="secondary">
            Manage builders
          </s-button>
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Setup checklist">
        <s-unordered-list>
          <s-list-item>Create a builder</s-list-item>
          <s-list-item>Add products</s-list-item>
          <s-list-item>Set min/max rules</s-list-item>
          <s-list-item>Customize progress UI</s-list-item>
          <s-list-item>Publish to storefront</s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}

function StatCard({ label, value }) {
  return (
    <s-box padding="base" borderWidth="base" borderRadius="base">
      <s-stack gap="small">
        <s-heading>{value}</s-heading>
        <s-text color="subdued">{label}</s-text>
      </s-stack>
    </s-box>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};