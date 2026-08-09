import { createRoot } from "react-dom/client";

console.log("Build a Box loaded");

const root = document.querySelector("[data-build-a-box-root]");

if (root) {
  const builderId = root.dataset.builderId;
  const builderHandle = root.dataset.builderHandle;

  console.log("Builder found:", {
    builderId,
    builderHandle,
  });

  createRoot(root).render(
    <div>
      <h2>Hello Build a Box 👋</h2>
      <p>Builder ID: {builderId}</p>
    </div>
  );
}