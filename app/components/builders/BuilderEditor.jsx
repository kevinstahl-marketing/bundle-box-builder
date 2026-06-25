import { useSubmit } from "react-router";
import BuilderSummaryCard from "./BuilderSummaryCard";
import AttachedProductCard from "./AttachedProductCard";
import BuilderStepsCard from "./BuilderStepsCard"



export default function BuilderEditor({ builder }) {
  const submit = useSubmit();

  async function attachProduct() {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
      multiple: false,
    });

    if (!products || products.length === 0) return;

    const product = products[0];

    const formData = new FormData();
    formData.append("intent", "attach-product");
    formData.append("productId", product.id);
    formData.append("productTitle", product.title);
    formData.append("productHandle", product.handle || "");
    formData.append("productImage", product.images?.[0]?.originalSrc || "");

    submit(formData, { method: "post" });
  }

  return (
    <s-section heading="Builder editor">
      <s-stack gap="base">
        <BuilderSummaryCard builder={builder} />
        <AttachedProductCard builder={builder} onAttachProduct={attachProduct} />
        <BuilderStepsCard builder={builder} />
      </s-stack>
    </s-section>
  );
}