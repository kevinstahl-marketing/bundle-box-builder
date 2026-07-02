export default function BuilderStepCustomPicker({
  step,
  addCustomOptionsToStep,
}) {
  return (
    <s-stack gap="small">
      <s-text-field label="Custom option" />
      <s-button>Add custom option</s-button>
    </s-stack>
  );
}