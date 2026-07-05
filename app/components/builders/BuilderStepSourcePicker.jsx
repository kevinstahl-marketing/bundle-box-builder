import BuilderStepProductPicker from "./BuilderStepProductPicker";
import BuilderStepAllProductsSource from "./BuilderStepAllProductsSource";
import BuilderStepCollectionPicker from "./BuilderStepCollectionPicker";
import BuilderStepTagSource from "./BuilderStepTagSource";
import BuilderStepVendorSource from "./BuilderStepVendorSource";

export default function BuilderStepSourcePicker({
  step,
  addProductsToStep,
  updateStep,
}) {
  const sourceType = step.sourceType ?? "SPECIFIC_PRODUCTS";

  switch (sourceType) {
    case "SPECIFIC_PRODUCTS":
      return (
        <BuilderStepProductPicker
          step={step}
          addProductsToStep={addProductsToStep}
          updateStep={updateStep}
        />
      );

    case "COLLECTION":
      return (
        <BuilderStepCollectionPicker
          step={step}
          updateStep={updateStep}
        />
      );

    case "ALL_PRODUCTS":
      return (
        <BuilderStepAllProductsSource
          step={step}
          updateStep={updateStep}
        />
      );

    case "TAG":
      return (
        <BuilderStepTagSource
          step={step}
          updateStep={updateStep}
        />
      );

    case "VENDOR":
      return (
        <BuilderStepVendorSource
          step={step}
          updateStep={updateStep}
        />
      );

    default:
      return null;
  }
}