import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Debug logs
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Key exists' : 'Key is missing');
console.log('Supabase Service Key:', supabaseServiceKey ? 'Key exists' : 'Key is missing');

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Client for regular user operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for admin operations (with higher privileges)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
