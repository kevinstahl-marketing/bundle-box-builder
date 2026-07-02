export default function BuilderStepProductPicker({ step, addProductsToStep }) {
  async function handleSelectProducts() {
    const selected = await shopify.resourcePicker({
      type: "product",
      multiple: true,
      action: "select",
    });

    if (!selected || selected.length === 0) return;

    const products = selected.map((product) => ({
      id: product.id,
      title: product.title,
      image: product.images?.[0]?.originalSrc ?? null,
      variantId: product.variants?.[0]?.id ?? null,
      variantTitle: product.variants?.[0]?.title ?? null,
    }));

    addProductsToStep(step.id, products);
  }

  return (
    <s-stack gap="small">
      <s-heading>Products</s-heading>

      <s-button onClick={handleSelectProducts}>
        Select products
      </s-button>
    </s-stack>
  );
}