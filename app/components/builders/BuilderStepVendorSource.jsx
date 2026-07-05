import { useEffect, useState } from "react";

export default function BuilderStepVendorSource({ step, updateStep }) {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadVendors() {
      setIsLoading(true);

      const response = await fetch("/app/resources/vendors");
      const data = await response.json();

      setVendors(data.vendors ?? []);
      setIsLoading(false);
    }

    loadVendors();
  }, []);

  function handleChange(event) {
    updateStep(step.id, {
      sourceValue: event.target.value,
    });
  }

  if (isLoading) {
    return <s-text color="subdued">Loading vendors...</s-text>;
  }

  return (
    <s-select
      label="Vendor"
      value={step.sourceValue ?? ""}
      onChange={handleChange}
    >
      <s-option value="">Choose a vendor</s-option>

      {vendors.map((vendor) => (
        <s-option key={vendor} value={vendor}>
          {vendor}
        </s-option>
      ))}
    </s-select>
  );
}