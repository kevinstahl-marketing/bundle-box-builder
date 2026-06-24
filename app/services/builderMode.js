export const BUILDER_MODES = [
  "BUILD_YOUR_OWN",
  "MIX_AND_MATCH",
  "FIXED_BUNDLE",
];

export function getModeLabel(mode) {
  if (mode === "BUILD_YOUR_OWN") return "Customers choose from categories";
  if (mode === "MIX_AND_MATCH") return "Customers choose any products";
  if (mode === "FIXED_BUNDLE") return "Customers don't choose";
  return "Unknown mode";
}