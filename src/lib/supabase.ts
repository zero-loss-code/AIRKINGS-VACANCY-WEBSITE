import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

const normalizedUrl = supabaseUrl.replace(/\/+$/, '');

// Use typed constants to avoid string | undefined in nested scopes
const SUPABASE_URL: string = normalizedUrl;
const SUPABASE_ANON_KEY: string = supabaseAnonKey;

// Detect key format
const isNewKey = SUPABASE_ANON_KEY.startsWith('sb_'); // new-style keys
const isJwtKey = SUPABASE_ANON_KEY.split('.').length === 3; // legacy anon/service JWT

// Sanity checks to aid debugging invalid key issues
if (!isNewKey && !isJwtKey) {
  console.warn('[Supabase] Key format is unusual. Ensure you are using the new "Publishable key" (sb_publishable_...) or the legacy anon JWT.');
}

try {
  if (isJwtKey) {
    const payloadPart = SUPABASE_ANON_KEY.split('.')[1];
    // base64url -> base64 with padding
    const toB64 = (s: string) => {
      const t = s.replace(/-/g, '+').replace(/_/g, '/');
      const pad = t.length % 4 === 2 ? '==' : t.length % 4 === 3 ? '=' : '';
      return t + pad;
    };
    const payload = JSON.parse(atob(toB64(payloadPart)));
    const keyRef = payload?.ref as string | undefined;

    // Extract ref from URL
    const m = SUPABASE_URL.match(/^https?:\/\/([a-z0-9\-]+)\.supabase\.co/i);
    const urlRef = m?.[1];

    if (keyRef && urlRef && keyRef !== urlRef) {
      console.error(`[Supabase] Project ref mismatch. Key ref=${keyRef} but URL ref=${urlRef}. Use the anon/publishable key from this project's API settings.`);
      throw new Error('Supabase project ref mismatch between URL and anon key.');
    }
    console.info(`[Supabase] Using URL=${SUPABASE_URL} | Legacy key prefix=${SUPABASE_ANON_KEY.slice(0, 8)}...`);
  } else {
    console.info(`[Supabase] Using URL=${SUPABASE_URL} | New key prefix=${SUPABASE_ANON_KEY.slice(0, 14)}...`);
  }
} catch {
  // ignore decode issues
}

// Create client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dev-only health check to quickly surface 401/invalid key issues
export async function checkSupabaseHealth() {
  if (!import.meta.env.DEV) return;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: new Headers({ apikey: SUPABASE_ANON_KEY }),
    });
    if (res.ok) {
      console.log('[Supabase] Health check OK.');
    } else {
      const body = await res.text();
      console.error(`[Supabase] Health check failed (${res.status}). Check that VITE_SUPABASE_ANON_KEY is the project "Publishable key". Body:`, body?.slice(0, 200));
    }
  } catch (e) {
    console.error('[Supabase] Health check error:', e);
  }
}

// Types for our database
export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  status: 'urgent' | 'now_recruiting' | 'closing_soon' | 'expired';
  description: string;
  requirements: string[];
  benefits: string[];
  media: Array<{
    type: 'image' | 'video';
    url: string;
    alt?: string;
    // Focus point within the image: 0..1 (x: left→right, y: top→bottom)
    focalX?: number;
    focalY?: number;
  }>;
  whatsapp_number: string;
  created_at: string;
  updated_at: string;
  sort_order: number; // added
}

export interface Database {
  public: {
    Tables: {
      job_postings: {
        Row: JobPosting;
        Insert: Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'sort_order'> & {
          sort_order?: number;
        };
        Update: Partial<Omit<JobPosting, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}