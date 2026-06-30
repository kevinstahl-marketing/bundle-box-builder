export default function BuilderStepRuleFields({ step, updateStep }) {
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