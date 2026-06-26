import { useAppBridge } from "@shopify/app-bridge-react";
import { Form, redirect, useLoaderData, useSubmit } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { useState } from "react";

import {
  createBuilder,
  getBuilder,
  attachBuilderProduct,
  addBuilderStep,
  updateBuilderStepRules,
} from "../services/builder.server";

import { BUILDER_MODES } from "../services/builderMode";

import NewBuilderPage from "../components/builders/NewBuilderPage";
import BuilderEditor from "../components/builders/BuilderEditor";

export async function loader({ request, params }) {
  const { session } = await authenticate.admin(request);

  if (params.id === "new") {
    return { mode: "new", builder: null };
  }

  const builder = await getBuilder(params.id, session.shop);

  if (!builder) {
    throw new Response("Builder not found", { status: 404 });
  }

  return { mode: "edit", builder };
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  console.log("=== ACTION FIRED ===");
  const intent = String(formData.get("intent") || "");

  switch (intent) {
    case "attach-product":
      return handleAttachProduct(params, session, formData);

    case "addStep":
      return handleAddStep(params, session, formData);

    case "updateStepRules":
      return handleUpdateStepRules(params, session, formData);

    default:
      return handleCreateBuilder(session, formData);
  }
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

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

async function handleAttachProduct(params, session, formData) {
  const product = {
    id: String(formData.get("productId") || ""),
    title: String(formData.get("productTitle") || ""),
    handle: String(formData.get("productHandle") || ""),
    image: String(formData.get("productImage") || ""),
  };

  await attachBuilderProduct(params.id, session.shop, product);

  return redirect(`/app/builders/${params.id}`);
}

async function handleAddStep(params, session, formData) {
  const title = String(formData.get("title") || "").trim();
  console.log("handleAddStep");
  await addBuilderStep({
    builderId: params.id,
    shop: session.shop,
    title,
  });

  return redirect(`/app/builders/${params.id}`);
}

async function handleCreateBuilder(session, formData) {
  const name = String(formData.get("name") || "").trim();
  const mode = String(formData.get("mode") || "BUILD_YOUR_OWN");

  if (!name) {
    return Response.json(
      { error: "Builder name is required" },
      { status: 400 },
    );
  }

  if (!BUILDER_MODES.includes(mode)) {
    return Response.json({ error: "Invalid builder mode" }, { status: 400 });
  }

  const builder = await createBuilder({
    shop: session.shop,
    name,
    mode,
  });

  return redirect(`/app/builders/${builder.id}`);
}

async function handleUpdateStepRules(params, session, formData) {
  const stepId = String(formData.get("stepId") || "");
  const minSelections = Number(formData.get("minSelections") || 0);

  const rawMaxSelections = formData.get("maxSelections");
  const maxSelections =
    rawMaxSelections === "" || rawMaxSelections == null
      ? null
      : Number(rawMaxSelections);

  await updateBuilderStepRules({
    stepId,
    shop: session.shop,
    minSelections,
    maxSelections,
  });

  return redirect(`/app/builders/${params.id}`);
}
