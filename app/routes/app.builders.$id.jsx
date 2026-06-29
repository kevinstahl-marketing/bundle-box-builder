import { redirect, useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

import {
  createBuilder,
  getBuilder,
  saveBuilderDraft,
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

  const intent = String(formData.get("intent") || "");

  if (intent === "saveBuilder") {
    const builder = JSON.parse(String(formData.get("builder") || "{}"));

    await saveBuilderDraft({
      shop: session.shop,
      builder,
    });

    return redirect(`/app/builders/${params.id}`);
  }

  return handleCreateBuilder(session, formData);
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