import { Form } from "react-router";

export default function BuilderStepsCard({ builder }) {
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

                  <BuilderStepRuleForm step={step} />
                </s-stack>
              </s-box>
            ))}
          </s-stack>
        )}
        <AddBuilderStepForm />{" "}
      </s-stack>
    </s-box>
  );
}

export function BuilderStepRuleForm({ step }) {
  return (
    <Form method="post">
      <input type="hidden" name="intent" value="updateStepRules" />
      <input type="hidden" name="stepId" value={step.id} />

      <s-stack gap="small">
        <s-number-field
          label="Minimum selections"
          name="minSelections"
          value={step.minSelections ?? 0}
          min={0}
        />
        <s-number-field
          label="Maximum selections"
          name="maxSelections"
          value={step.maxSelections ?? ""}
          min={0}
        />
        <s-button type="submit">Save rules</s-button>
      </s-stack>
    </Form>
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

function AddBuilderStepForm() {
  return (
    <Form method="post">
      <input type="hidden" name="intent" value="addStep" />

      <s-stack gap="small">
        <s-text-field
          label="Step title"
          name="title"
          placeholder="Choose snacks"
          required
        />

        <s-button type="submit" variant="primary">
          Add step
        </s-button>
      </s-stack>
    </Form>
  );
}
