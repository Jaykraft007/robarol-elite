import { companyProfile, listingCatalog, navigationLinks } from "./site-data.data";
import type { SiteDataSnapshot } from "./site-data.types";

export async function fetchSiteData(): Promise<SiteDataSnapshot> {
    return Promise.resolve({
        company: companyProfile,
        navigation: navigationLinks,
        listings: listingCatalog
    });
}
