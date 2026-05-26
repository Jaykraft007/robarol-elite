import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import { router } from "./app/router";
import { AdminSessionProvider } from "./modules/admin-session/admin-session.context";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found.");
}

createRoot(rootElement).render(
    <StrictMode>
        <AdminSessionProvider>
            <RouterProvider router={router} />
        </AdminSessionProvider>
    </StrictMode>
);
