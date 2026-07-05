import { useEffect, useState } from "react";

export default function BuilderStepCollectionPicker({ step, updateStep }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
      const response = await fetch("/app/resources/collections");

      if (!response.ok) {
        console.error("Failed to load collections", response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setCollections(data.collections ?? []);
      setLoading(false);
    }

    loadCollections();
  }, []);

  if (loading) {
    return <s-text>Loading collections...</s-text>;
  }

  if (collections.length === 0) {
    return <s-text>No collections found.</s-text>;
  }

  return (
    <s-stack gap="small">
      {collections.map((collection) => {
        const selected = step.sourceValue === collection.id;

        return (
          <s-button
            key={collection.id}
            variant={selected ? "primary" : "secondary"}
            onClick={() =>
              updateStep(step.id, {
                sourceType: "COLLECTION",
                sourceValue: collection.id,
              })
            }
          >
            {collection.title}
          </s-button>
        );
      })}
    </s-stack>
  );
}