export default function BuilderStepOptionItem({ option, onRemove }) {
  const isProduct = option.type === "PRODUCT";

  return (
    <s-box padding="small" borderWidth="base" borderRadius="base">
      <s-stack gap="small">
        <s-text>{option.title}</s-text>

        <s-text color="subdued">
          {isProduct ? "Shopify product" : "Custom option"}
        </s-text>

        {option.image ? (
          <s-thumbnail src={option.image} alt={option.title} size="small" />
        ) : null}

        <s-button
          variant="tertiary"
          tone="critical"
          onClick={onRemove}
        >
          Remove
        </s-button>
      </s-stack>
    </s-box>
  );
}