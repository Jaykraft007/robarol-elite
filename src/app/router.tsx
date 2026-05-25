import { createBrowserRouter, Navigate } from "react-router";

import { AdminLayout } from "../components/admin/admin-layout";
import { SiteLayout } from "../components/layout/site-layout";
import { SiteDataProvider } from "../modules/site-data/site-data.context";
import { AdminListingFormPage } from "../pages/admin-listing-form-page";
import { AdminListingsPage } from "../pages/admin-listings-page";
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

function AdminRoot() {
    return (
        <SiteDataProvider>
            <AdminLayout />
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
        path: "/admin",
        element: <AdminRoot />,
        children: [
            { index: true, element: <Navigate to="/admin/listings" replace /> },
            { path: "listings", element: <AdminListingsPage /> },
            { path: "listings/new", element: <AdminListingFormPage /> },
            { path: "listings/:listingId/edit", element: <AdminListingFormPage /> }
        ]
    },
    {
        path: "*",
        element: <NotFoundPage />
    }
]);
