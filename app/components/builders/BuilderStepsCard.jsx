import { useState } from "react";

export default function BuilderStepsCard({ builder, addStep, updateStep }) {
  const steps = builder.steps ?? [];

  return (
    <s-box padding="base" borderWidth="base" borderRadius="base">
      <s-stack gap="base">
        <s-heading>Steps</s-heading>

        {steps.length === 0 ? (
          <s-text color="subdued">
            No steps yet. Add a step like “Choose snacks” or “Choose a drink.”
          </s-text>
        ) : (
          <s-stack gap="small">
            {steps.map((step) => (
              <s-box
                key={step.id}
                padding="base"
                borderWidth="base"
                borderRadius="base"
              >
                <s-stack gap="small">
                  <s-heading>{step.title}</s-heading>

                  <s-text color="subdued">{getStepRuleLabel(step)}</s-text>

                  <BuilderStepRuleFields step={step} updateStep={updateStep} />
                </s-stack>
              </s-box>
            ))}
          </s-stack>
        )}

        <AddBuilderStepField addStep={addStep} />
      </s-stack>
    </s-box>
  );
}

export function BuilderStepRuleFields({ step, updateStep }) {
  return (
    <s-stack gap="small">
      <s-number-field
        label="Minimum selections"
        value={step.minSelections ?? 0}
        min={0}
        onInput={(e) =>
          updateStep(step.id, {
            minSelections: Number(e.target.value),
          })
        }
      />

      <s-number-field
        label="Maximum selections"
        value={step.maxSelections ?? ""}
        min={0}
        onInput={(e) =>
          updateStep(step.id, {
            maxSelections:
              e.target.value === "" ? null : Number(e.target.value),
          })
        }
      />
    </s-stack>
  );
}

function AddBuilderStepField({ addStep }) {

  const [title, setTitle] = useState("");

  function handleAddStep() {
    const cleanTitle = title.trim();
      console.log("ADDING STEP:", cleanTitle);

    if (!cleanTitle) return;

    addStep(cleanTitle);
    setTitle("");
  }

  return (
    <s-stack gap="small">
      <s-text-field
        label="Step title"
        value={title}
        placeholder="Choose snacks"
        onInput={(e) => setTitle(e.target.value)}
      />

      <s-button variant="primary" onClick={handleAddStep}>
        Add step
      </s-button>
    </s-stack>
  );
}

function getStepRuleLabel(step) {
  const min = step.minSelections ?? 0;
  const max = step.maxSelections;

  if (max == null) return `Choose at least ${min}`;
  if (min === max) return `Choose exactly ${min}`;
  if (min === 0) return `Choose up to ${max}`;
  return `Choose ${min} to ${max}`;
}
