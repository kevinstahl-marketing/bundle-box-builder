import { useState } from "react";

import BuilderSummaryCard from "./BuilderSummaryCard";
import AttachedProductCard from "./AttachedProductCard";
import BuilderStepsCard from "./BuilderStepsCard";

export default function BuilderEditor({ builder }) {
  const [draft, setDraft] = useState(builder);

  async function attachProduct() {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
      multiple: false,
    });

    if (!products?.length) return;

    const product = products[0];

    setDraft((current) => ({
      ...current,
      product: {
        id: product.id,
        title: product.title,
        handle: product.handle || "",
        image: product.images?.[0]?.originalSrc || "",
      },
    }));
  }

  function addStep(title) {
    setDraft((builder) => ({
      ...builder,
      steps: [
        ...(builder.steps ?? []),
        {
          id: crypto.randomUUID(),
          title,
          minSelections: 0,
          maxSelections: null,
          options: [],
        },
      ],
    }));
  }

  function updateStep(stepId, changes) {
    setDraft((builder) => ({
      ...builder,
      steps: (builder.steps ?? []).map((step) =>
        step.id === stepId ? { ...step, ...changes } : step
      ),
    }));
  }

  return (
    <s-section heading="Builder editor">
      <s-stack gap="base">
        <BuilderSummaryCard builder={draft} />

        <AttachedProductCard
          builder={draft}
          onAttachProduct={attachProduct}
        />

        <BuilderStepsCard
          builder={draft}
          updateStep={updateStep}
          addStep={addStep}
        />
      </s-stack>
    </s-section>
  );
}