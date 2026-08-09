import { createRoot } from "react-dom/client";

console.log("Build a Box loaded");

const root = document.querySelector(".build-a-box-root");

if (root) {
  createRoot(root).render(
    <div>
      <h2>Hello Build a Box 👋</h2>
    </div>
  );
}