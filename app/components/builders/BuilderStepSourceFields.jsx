export default function BuilderStepSourceFields({ step, updateStep }) {
  const sourceType = step.sourceType ?? "SPECIFIC_PRODUCTS";

  function handleSourceTypeChange(event) {
    const nextSourceType = event.target.value;

    updateStep(step.id, {
      sourceType: nextSourceType,
      sourceValue: nextSourceType === "ALL_PRODUCTS" ? null : step.sourceValue ?? "",
    });
  }

  function handleSourceValueChange(event) {
    updateStep(step.id, {
      sourceValue: event.target.value,
    });
  }

  
  return (
    <s-select
      label="Product source"
      value={sourceType}
      onChange={handleSourceTypeChange}
    >
      <s-option value="SPECIFIC_PRODUCTS">Specific products</s-option>
      <s-option value="COLLECTION">Collection</s-option>
      <s-option value="ALL_PRODUCTS">All products</s-option>
      <s-option value="TAG">Product tag</s-option>
      <s-option value="VENDOR">Vendor</s-option>
    </s-select>
  );
}