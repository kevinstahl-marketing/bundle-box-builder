import { useSubmit } from "react-router";


export default function NewBuilderPage() {
  const submit = useSubmit();
  return (
    <>
      {" "}
      <s-section heading="Builder basics">
        {" "}
        <form method="post" id="new-builder-form">
          {" "}
          <s-stack gap="base">
            {" "}
            <s-text-field
              name="name"
              label="Builder name"
              placeholder="Example: Holiday Gift Box"
            />{" "}
            <s-section>
              {" "}
              <s-choice-list
                label="How will customers build this bundle?"
                name="mode"
                value="BUILD_YOUR_OWN"
              >
                {" "}
                <s-choice value="BUILD_YOUR_OWN">
                  {" "}
                  Customers choose from categories{" "}
                </s-choice>{" "}
                <s-choice value="MIX_AND_MATCH">
                  {" "}
                  Customers choose any products{" "}
                </s-choice>{" "}
                <s-choice value="FIXED_BUNDLE">
                  Customers don't choose
                </s-choice>{" "}
              </s-choice-list>{" "}
              <s-button
                variant="primary"
                onClick={() => {
                  const form = document.getElementById("new-builder-form");
                  submit(form);
                }}
              >
                {" "}
                Create builder{" "}
              </s-button>{" "}
            </s-section>{" "}
          </s-stack>{" "}
        </form>{" "}
      </s-section>{" "}
      <s-section slot="aside" heading="Builder setup">
        {" "}
        <s-unordered-list>
          {" "}
          <s-list-item>Name the builder</s-list-item>{" "}
          <s-list-item>Add selectable products</s-list-item>{" "}
          <s-list-item>Set min and max rules</s-list-item>{" "}
          <s-list-item>Customize progress UI</s-list-item>{" "}
          <s-list-item>Publish to storefront</s-list-item>{" "}
        </s-unordered-list>{" "}
      </s-section>{" "}
    </>
  );
}
