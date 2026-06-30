export default function BuilderOptionItem({
  stepId,
  option,
  attachOptionProduct,
}) {
  const hasProduct = Boolean(option.productId);

  return (
    <s-box padding="small" borderWidth="base" borderRadius="base">
      <s-stack gap="small">
        <s-text>{option.title}</s-text>

        {hasProduct ? (
          <s-stack gap="small">
            <s-text color="subdued">
              {option.productTitle}
              {option.variantTitle && option.variantTitle !== "Default Title"
                ? ` — ${option.variantTitle}`
                : ""}
            </s-text>

            <s-button onClick={() => attachOptionProduct(stepId, option.id)}>
              Change product
            </s-button>
          </s-stack>
        ) : (
          <s-stack gap="small">
            <s-text color="subdued">No product attached.</s-text>

            <s-button onClick={() => attachOptionProduct(stepId, option.id)}>
              Attach product
            </s-button>
          </s-stack>
        )}
      </s-stack>
    </s-box>
  );
}