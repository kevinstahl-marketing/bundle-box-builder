import BuilderStepOptionItem from "./BuilderStepOptionItem";

export default function BuilderStepOptionsList({ step, removeOptionFromStep }) {
  const options = step.options ?? [];

  return (
    <s-stack gap="small">
      <s-heading>Selected options</s-heading>

      {options.length === 0 ? (
        <s-text color="subdued">No options selected yet.</s-text>
      ) : (
        <s-stack gap="small">
          {options.map((option) => (
            <BuilderStepOptionItem
              key={option.id}
              stepId={step.id}
              option={option}
              onRemove={() => removeOptionFromStep(step.id, option.id)}
            />
          ))}
        </s-stack>
      )}
    </s-stack>
  );
}