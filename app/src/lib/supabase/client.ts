import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase environment variables are not set. Running in offline mode.');
        // Return a mock client that won't crash the app
        return null as unknown as ReturnType<typeof createBrowserClient>;
    }
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
