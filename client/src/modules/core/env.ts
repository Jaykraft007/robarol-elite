function getRequiredClientEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY") {
    const value = import.meta.env[name]?.trim();

    if (!value) {
        throw new Error(`Missing required client environment variable: ${name}.`);
    }

    return value;
}

export const supabaseUrl = getRequiredClientEnv("VITE_SUPABASE_URL");
export const supabaseAnonKey = getRequiredClientEnv("VITE_SUPABASE_ANON_KEY");
