
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iuuvznrtfrlgmrplnudw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1dXZ6bnJ0ZnJsZ21ycGxudWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNDMxMzEsImV4cCI6MjA1ODgxOTEzMX0._RhJoajxHSL8bYJdnmNI-c5cROf_Wl_SjcHJhqP01bo";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage
    }
  }
);
