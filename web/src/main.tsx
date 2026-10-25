import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.css";
import "./lib/axios/interceptors.ts";

import App from "./App.tsx";

import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/feedback/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
