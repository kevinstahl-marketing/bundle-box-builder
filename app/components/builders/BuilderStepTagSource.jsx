import { useEffect, useState } from "react";

export default function BuilderStepTagSource({ step, updateStep }) {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTags() {
      try {
        const response = await fetch("/app/resources/product-tags");

        if (!response.ok) {
          throw new Error("Failed to fetch product tags");
        }

        const data = await response.json();

        console.log("Loaded product tags:", data);

        setTags(data.tags ?? []);
      } catch (error) {
        console.error("Failed to load product tags:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTags();
  }, []);

  function handleChange(event) {
    const tag = event.target.value;

    updateStep(step.id, {
      sourceValue: tag,
      products: [],
    });
  }

  if (isLoading) {
    return <s-text color="subdued">Loading product tags...</s-text>;
  }

  return (
    <s-select
      label="Product tag"
      value={step.sourceValue ?? ""}
      onChange={handleChange}
    >
      <s-option value="">Choose a tag</s-option>

      {tags.map((tag) => (
        <s-option key={tag} value={tag}>
          {tag}
        </s-option>
      ))}
    </s-select>
  );
}