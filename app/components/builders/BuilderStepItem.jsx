import BuilderStepRuleFields from "./BuilderStepRuleFields";
import BuilderStepOptionsList from "./BuilderStepOptionsList";
import BuilderStepProductPicker from "./BuilderStepProductPicker";
import BuilderStepCustomPicker from "./BuilderStepCustomPicker";

export default function BuilderStepItem({
  step,
  updateStep,
  addCustomOptionsToStep,
  addProductsToStep,
  removeOptionFromStep,
}) {
  return (
    <s-box padding="base" borderWidth="base" borderRadius="base">
      <s-stack gap="small">
        <s-heading>{step.title}</s-heading>

        <s-text color="subdued">{getStepRuleLabel(step)}</s-text>

        <BuilderStepRuleFields step={step} updateStep={updateStep} />

        <BuilderStepProductPicker
          step={step}
          addProductsToStep={addProductsToStep}
          removeOptionFromStep={removeOptionFromStep}
        />
        <BuilderStepCustomPicker
          step={step}
          addCustomOptionsToStep={addCustomOptionsToStep}
        />

        <BuilderStepOptionsList
          step={step}
          removeOptionFromStep={removeOptionFromStep}
        />
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
