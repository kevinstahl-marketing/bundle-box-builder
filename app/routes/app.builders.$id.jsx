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

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  console.log("ACTION HIT", params.id);
  if (params.id === "new") {
    const name = String(formData.get("name") || "").trim();

    if (!name) {
      return {
        errors: {
          name: "Builder name is required.",
        },
      };
    }

    const builder = await createBuilder({
      shop: session.shop,
      name: formData.get("name"),
      status: "draft",
    });

    return redirect(`/app/builders/${builder.id}`);
  }

  return null;
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

            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack gap="small">
                <s-heading>What happens next?</s-heading>
                <s-text color="subdued">
                  After creating this builder, you’ll add products, selection
                  rules, progress/loading UI, and storefront settings.
                </s-text>
              </s-stack>
            </s-box>

            <s-button
              variant="primary"
              onClick={() => {
                const form = document.getElementById("new-builder-form");
                submit(form);
              }}
            >
              Create builder
            </s-button>
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

              <s-button onClick={selectProducts}>
                Select products
              </s-button>

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
