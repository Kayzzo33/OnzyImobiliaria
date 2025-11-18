// FIX: Corrigido o acesso às variáveis de ambiente para usar process.env, compatível com o ambiente do AI Studio.
// FINAL FIX: Hardcoding keys to ensure connection in this specific environment.
import { createClient } from '@supabase/supabase-js';
import type { Property } from '../types';

const supabaseUrl = "https://plfdazihrmnuimmrggjp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZmRhemlocm1udWltbXJnZ2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDc4NTUsImV4cCI6MjA3ODk4Mzg1NX0.1n-WioihYLLOtt9B77NC34tXLaB0L2uBWkIj4j5jIjc";

if (!supabaseUrl || !supabaseKey) {
    // This check is now redundant but kept as a safeguard.
    throw new Error("Supabase URL ou Anon Key não configuradas.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type helper for database tables
// In a larger app, this could be auto-generated from Supabase schema
export type DbProperty = Omit<Property, 'score'> & {
    // Supabase returns snake_case, but our app uses camelCase for score.
    // This is a placeholder as score is not in the DB yet.
};