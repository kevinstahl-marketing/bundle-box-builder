import { getModeLabel } from "../../services/builderMode";
export default function BuilderSummaryCard({ builder }) {
  return (
    <s-box padding="base" borderWidth="base" borderRadius="base">
      <s-stack gap="small">
        <s-heading>{builder.name}</s-heading>

        <s-text color="subdued">
          Mode: {getModeLabel(builder.mode)}
        </s-text>

        <s-text color="subdued">
          Status: {builder.status ?? "draft"}
        </s-text>
      </s-stack>
    </s-box>
  );
}