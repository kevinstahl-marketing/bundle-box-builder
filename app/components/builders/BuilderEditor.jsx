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

  const isDirty = JSON.stringify(draft) !== JSON.stringify(initialDraft);

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
        builder: JSON.stringify(stripTempIds(draft)),
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
          id: `temp-${crypto.randomUUID()}`,
          title,
          position: builder.steps?.length ?? 0,
          minSelections: 0,
          maxSelections: null,
          isRequired: true,
          isVisible: true,
          options: [],
        },
      ],
    }));
  }

  function addOption(stepId, title) {
    setDraft((builder) => ({
      ...builder,
      steps: (builder.steps ?? []).map((step) => {
        if (step.id !== stepId) return step;

        const options = step.options ?? [];

        return {
          ...step,
          options: [
            ...options,
            {
              id: `temp-${crypto.randomUUID()}`,
              stepId,
              title,
              position: options.length,
              type: "PRODUCT",
              productId: null,
              variantId: null,
              productTitle: null,
              variantTitle: null,
              image: null,
              priceAdjustment: null,
            },
          ],
        };
      }),
    }));
  }

  async function attachOptionProduct(stepId, optionId) {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
      multiple: false,
    });

    if (!products?.length) return;

    const product = products[0];
    const variant = product.variants?.[0];

    setDraft((builder) => ({
      ...builder,
      steps: (builder.steps ?? []).map((step) => {
        if (step.id !== stepId) return step;

        return {
          ...step,
          options: (step.options ?? []).map((option) =>
            option.id === optionId
              ? {
                  ...option,
                  type: "PRODUCT",
                  productId: product.id,
                  variantId: variant?.id ?? null,
                  productTitle: product.title,
                  variantTitle: variant?.title ?? null,
                  image: product.images?.[0]?.originalSrc ?? null,
                }
              : option,
          ),
        };
      }),
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
            addOption={addOption}
            attachOptionProduct={attachOptionProduct}
          />
        </s-stack>
      </s-section>
    </>
  );
}

function isTempId(id) {
  return typeof id === "string" && id.startsWith("temp-");
}

function stripTempIds(builder) {
  return {
    ...builder,
    steps: (builder.steps ?? []).map((step) => ({
      ...step,
      id: isTempId(step.id) ? undefined : step.id,
      options: (step.options ?? []).map((option) => ({
        ...option,
        id: isTempId(option.id) ? undefined : option.id,
      })),
    })),
  };
}
