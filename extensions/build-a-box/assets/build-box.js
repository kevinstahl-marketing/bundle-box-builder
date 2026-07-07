// extensions/build-a-box/assets/build-box.js

async function loadBuildABox() {
  const root = document.querySelector("#build-a-box-root");

  if (!root) return;

  try {
    const response = await fetch("/apps/build-a-box");
    //Proxy from shopify.app.toml
    if (!response.ok) {
      root.innerHTML = "<p>Could not load Build a Box.</p>";
      return;
    }

    const data = await response.json();
    const builders = data.builders ?? [];

    if (builders.length === 0) {
      root.innerHTML = "<p>No published builders found.</p>";
      return;
    }

    root.innerHTML = `
      <div>
        <h3>Build a Box Builders</h3>
        <ul>
          ${builders
            .map(
              (builder) => `
                <li>
                  <strong>${builder.name}</strong>
                  ${
                    builder.productTitle
                      ? `<span> — ${builder.productTitle}</span>`
                      : ""
                  }
                </li>
              `,
            )
            .join("")}
        </ul>
      </div>
    `;
  } catch (error) {
    console.error("Build a Box failed to load", error);
    root.innerHTML = "<p>Build a Box failed to load.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadBuildABox);
