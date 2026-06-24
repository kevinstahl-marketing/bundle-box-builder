export default function AttachedProductCard({ builder, onAttachProduct }) {
  return (
    <s-box padding="base" borderWidth="base" borderRadius="base">
      <s-stack gap="base">
        <s-heading>Attached product</s-heading>

        {builder.productId ? (
          <s-stack gap="small">
            <s-text>{builder.productTitle}</s-text>
            <s-text color="subdued">
              This builder will appear on this product page.
            </s-text>
            <s-button onClick={onAttachProduct}>Change product</s-button>
          </s-stack>
        ) : (
          <s-stack gap="small">
            <s-text color="subdued">
              Attach this builder to the Shopify product customers will buy.
            </s-text>
            <s-button variant="primary" onClick={onAttachProduct}>
              Attach product
            </s-button>
          </s-stack>
        )}
      </s-stack>
    </s-box>
  );
}