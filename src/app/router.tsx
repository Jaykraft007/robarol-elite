import { createBrowserRouter } from "react-router";

import { SiteLayout } from "../components/layout/site-layout";
import { SiteDataProvider } from "../modules/site-data/site-data.context";
import { AboutPage } from "../pages/about-page";
import { ContactPage } from "../pages/contact-page";
import { FinancePage } from "../pages/finance-page";
import { HomePage } from "../pages/home-page";
import { InventoryPage } from "../pages/inventory-page";
import { NotFoundPage } from "../pages/not-found-page";
import { ServicesPage } from "../pages/services-page";

function AppRoot() {
    return (
        <SiteDataProvider>
            <SiteLayout />
        </SiteDataProvider>
    );
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppRoot />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "inventory", element: <InventoryPage /> },
            { path: "services", element: <ServicesPage /> },
            { path: "finance", element: <FinancePage /> },
            { path: "about", element: <AboutPage /> },
            { path: "contact", element: <ContactPage /> }
        ]
    },
    {
        path: "*",
        element: <NotFoundPage />
    }
]);
