import { useAppBridge } from "@shopify/app-bridge-react";
import { Form, redirect, useLoaderData, useSubmit } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { useState } from "react";

import { createBuilder, getBuilder } from "../services/builder.server";

export async function loader({ request, params }) {
  const { session } = await authenticate.admin(request);

  if (params.id === "new") {
    return {
      mode: "new",
      builder: null,
    };
  }

  const builder = await getBuilder(params.id, session.shop);

  if (!builder) {
    throw new Response("Builder not found", { status: 404 });
  }

  return {
    mode: "edit",
    builder,
  };
}

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const name = String(formData.get("name") || "").trim();
  const mode = String(formData.get("mode") || "BUILD_YOUR_OWN");

  if (!name) {
    return Response.json(
      { error: "Builder name is required" },
      { status: 400 },
    );
  }

  const allowedModes = ["BUILD_YOUR_OWN", "MIX_AND_MATCH", "FIXED_BUNDLE"];

  if (!allowedModes.includes(mode)) {
    return Response.json({ error: "Invalid builder mode" }, { status: 400 });
  }

  const builder = await createBuilder({
    shop: session.shop,
    name,
    mode,
  });

  return redirect(`/app/builders/${builder.id}`);
}

export default function BuilderRoute() {
  const { mode, builder } = useLoaderData();
  const isNew = mode === "new";

  return (
    <s-page heading={isNew ? "Create builder" : builder.name}>
      <s-button href="/app/builders" slot="secondary-actions">
        Back to builders
      </s-button>

      {isNew ? <NewBuilderPage /> : <BuilderEditor builder={builder} />}
    </s-page>
  );
}

function NewBuilderPage() {
  const submit = useSubmit();

  return (
    <>
      <s-section heading="Builder basics">
        <Form method="post" id="new-builder-form">
          <s-stack gap="base">
            <s-text-field
              name="name"
              label="Builder name"
              placeholder="Example: Holiday Gift Box"
            />

            <s-section>
              <s-choice-list
                label="How will customers build this bundle?"
                name="mode"
                value="BUILD_YOUR_OWN"
              >
                <s-choice value="BUILD_YOUR_OWN">
                  Customers choose from categories
                </s-choice>

                <s-choice value="MIX_AND_MATCH">
                  Customers choose any products
                </s-choice>

                <s-choice value="FIXED_BUNDLE">Customers don't choose</s-choice>
              </s-choice-list>

              <s-button
                variant="primary"
                onClick={() => {
                  const form = document.getElementById("new-builder-form");
                  submit(form);
                }}
              >
                Create builder
              </s-button>
            </s-section>
          </s-stack>
        </Form>
      </s-section>

      <s-section slot="aside" heading="Builder setup">
        <s-unordered-list>
          <s-list-item>Name the builder</s-list-item>
          <s-list-item>Add selectable products</s-list-item>
          <s-list-item>Set min and max rules</s-list-item>
          <s-list-item>Customize progress UI</s-list-item>
          <s-list-item>Publish to storefront</s-list-item>
        </s-unordered-list>
      </s-section>
    </>
  );
}

function BuilderEditor({ builder }) {
  const [selectedProducts, setSelectedProducts] = useState([]);

  async function selectProducts() {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
      multiple: true,
      filter: {
        variants: true,
      },
    });

    if (!products) return;

    console.log("Selected products:", products);
    setSelectedProducts(products);
  }

  return (
    <>
      <s-section heading="Builder editor">
        <s-stack gap="base">
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-stack gap="small">
              <s-heading>{builder.name}</s-heading>

              <s-text color="subdued">
                Mode: {getModeLabel(builder.mode)}
              </s-text>

              <s-text color="subdued">
                Status: {builder.status ?? "draft"}
              </s-text>
            </s-stack>
          </s-box>

          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-stack gap="base">
              <s-heading>Products</s-heading>
              <s-text color="subdued">
                Choose the Shopify products customers can pick from.
              </s-text>

              <s-button onClick={selectProducts}>Select products</s-button>

              {selectedProducts.length > 0 && (
                <s-stack gap="small">
                  {selectedProducts.map((product) => (
                    <s-box
                      key={product.id}
                      padding="base"
                      borderWidth="base"
                      borderRadius="base"
                    >
                      <s-text>{product.title}</s-text>
                    </s-box>
                  ))}
                </s-stack>
              )}
            </s-stack>
          </s-box>

          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-stack gap="small">
              <s-heading>Rules</s-heading>
              <s-text color="subdued">
                Min/max selection rules will go here.
              </s-text>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>
    </>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

function getModeLabel(mode) {
  if (mode === "BUILD_YOUR_OWN") return "Customers choose from categories";
  if (mode === "MIX_AND_MATCH") return "Customers choose any products";
  if (mode === "FIXED_BUNDLE") return "Customers don't choose";
  return "Unknown mode";
}
