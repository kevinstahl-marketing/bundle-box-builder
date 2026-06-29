import { useEffect, useRef, useState } from "react";
import { useSubmit } from "react-router";

import BuilderSummaryCard from "./BuilderSummaryCard";
import AttachedProductCard from "./AttachedProductCard";
import BuilderStepsCard from "./BuilderStepsCard";

export default function BuilderEditor({ builder }) {
  const [initialDraft, setInitialDraft] = useState(builder);
  const [draft, setDraft] = useState(builder);

  const submit = useSubmit();
  const saveBarRef = useRef(null);

  const isDirty =
    JSON.stringify(draft) !== JSON.stringify(initialDraft);

  useEffect(() => {
    const saveBar = saveBarRef.current;
    if (!saveBar) return;

    if (isDirty) {
      saveBar.show();
    } else {
      saveBar.hide();
    }
  }, [isDirty]);

  useEffect(() => {
    setInitialDraft(builder);
    setDraft(builder);
  }, [builder]);

  function saveBuilder(e) {
    e?.preventDefault();

    submit(
      {
        intent: "saveBuilder",
        builder: JSON.stringify(draft),
      },
      { method: "post" },
    );
  }

  function discardChanges(e) {
    e?.preventDefault();
    setDraft(initialDraft);
    saveBarRef.current?.hide();
  }

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
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle || "",
      productImage: product.images?.[0]?.originalSrc || "",
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
        step.id === stepId ? { ...step, ...changes } : step,
      ),
    }));
  }

  return (
    <>
      <ui-save-bar ref={saveBarRef} id="builder-editor-save-bar">
        <button variant="primary" onClick={saveBuilder}></button>
        <button onClick={discardChanges}></button>
      </ui-save-bar>

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
    </>
  );
}