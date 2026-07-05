import BuilderStepRuleFields from "./BuilderStepRuleFields";
import BuilderStepOptionsList from "./BuilderStepOptionsList";
import BuilderStepSourceFields from "./BuilderStepSourceFields";
import BuilderStepSourcePicker from "./BuilderStepSourcePicker";

export default function BuilderStepItem({
  step,
  updateStep,
  addCustomOptionsToStep,
  addProductsToStep,
  removeOptionFromStep,
}) {
  return (
    <s-box padding="base" borderWidth="base" borderRadius="base">
      <s-stack gap="base">
        <StepHeader step={step} />

        <StepSection title="Selection rules">
          <BuilderStepRuleFields step={step} updateStep={updateStep} />
        </StepSection>

        <StepSection title="Product source">
          <BuilderStepSourceFields step={step} updateStep={updateStep} />
        </StepSection>

        <StepSection title="Source options">
          <BuilderStepSourcePicker
            step={step}
            updateStep={updateStep}
            addProductsToStep={addProductsToStep}
            addCustomOptionsToStep={addCustomOptionsToStep}
          />
        </StepSection>

        <StepSection title="Current choices">
          <BuilderStepOptionsList
            step={step}
            removeOptionFromStep={removeOptionFromStep}
          />
        </StepSection>
      </s-stack>
    </s-box>
  );
}

function StepHeader({ step }) {
  return (
    <s-stack gap="small">
      <s-heading>{step.title}</s-heading>
      <s-text color="subdued">{getStepRuleLabel(step)}</s-text>
    </s-stack>
  );
}

function StepSection({ title, children }) {
  return (
    <s-box padding="base" borderWidth="base" borderRadius="base">
      <s-stack gap="small">
        <s-text type="strong">{title}</s-text>
        {children}
      </s-stack>
    </s-box>
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