import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";

// Ensure a default theme class is applied at startup
const rootEl = document.documentElement;
if (!rootEl.classList.contains('theme-beige') && !rootEl.classList.contains('theme-green') && !rootEl.classList.contains('theme-mono')) {
  rootEl.classList.add('theme-beige');
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </StrictMode>
);
