import { supabaseServiceClient } from "./lib/supabase.js";
import { defaultListingCatalog } from "./default-listings.js";

async function seed() {
    const { count, error: countError } = await supabaseServiceClient
        .from("listings")
        .select("*", { count: "exact", head: true });

    if (countError) {
        throw countError;
    }

    if ((count ?? 0) > 0) {
        console.log("Listings table already has data. Skipping seed.");
        return;
    }

    const payload = defaultListingCatalog.map((listing) => ({
        title: listing.title,
        category: listing.category,
        status: listing.status,
        price: listing.price,
        short_description: listing.shortDescription,
        main_image_url: listing.mainImage,
        gallery_images: listing.galleryImages,
        featured: listing.featured,
        show_on_website: listing.showOnWebsite,
        inquiry_label: listing.inquiryLabel,
        specs: listing.specs
    }));

    const { error } = await supabaseServiceClient.from("listings").insert(payload);

    if (error) {
        throw error;
    }

    console.log(`Seeded ${payload.length} listings.`);
}

seed().catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
});
