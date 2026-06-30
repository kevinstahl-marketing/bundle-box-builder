import { useState } from "react";
import BuilderStepItem from "./BuilderStepItem";

export default function BuilderStepsCard({ builder, addStep, updateStep, addOption, attachOptionProduct }) {
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
              <BuilderStepItem
                key={step.id}
                step={step}
                updateStep={updateStep}
                addOption={addOption}
                attachOptionProduct={attachOptionProduct}
              />
            ))}
          </s-stack>
        )}

        <AddBuilderStepField addStep={addStep} />
      </s-stack>
    </s-box>
  );
}

function AddBuilderStepField({ addStep }) {
  const [title, setTitle] = useState("");

  function handleAddStep() {
    const cleanTitle = title.trim();
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