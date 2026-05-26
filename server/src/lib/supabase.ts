import { createClient } from "@supabase/supabase-js";

import { env } from "../config/env.js";

const clientConfig = {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
};

export const supabasePublicClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, clientConfig);

export const supabaseServiceClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, clientConfig);

export function createSupabaseAuthClient() {
    return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, clientConfig);
}
