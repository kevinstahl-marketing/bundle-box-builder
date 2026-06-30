import { useState } from "react";
import BuilderStepOptionItem from "./BuilderStepOptionItem";

export default function BuilderOptionsList({
  step,
  addOption,
  attachOptionProduct,
}) {
  const [title, setTitle] = useState("");
  const options = step.options ?? [];

  function handleAddOption() {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    addOption(step.id, cleanTitle);
    setTitle("");
  }

  return (
    <s-stack gap="small">
      <s-heading>Options</s-heading>

      {options.length === 0 ? (
        <s-text color="subdued">No options yet.</s-text>
      ) : (
        <s-stack gap="small">
          {options.map((option) => (
            <BuilderStepOptionItem
              key={option.id}
              stepId={step.id}
              option={option}
              attachOptionProduct={attachOptionProduct}
            />
          ))}
        </s-stack>
      )}

      <s-stack gap="small">
        <s-text-field
          label="Option title"
          value={title}
          placeholder="Chocolate chip cookie"
          onInput={(e) => setTitle(e.target.value)}
        />

        <s-button onClick={handleAddOption}>Add option</s-button>
      </s-stack>
    </s-stack>
  );
}