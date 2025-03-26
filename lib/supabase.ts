import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type Lead = {
  id: string;
  business_name: string;
  phone: string;
  status: 'Pending' | 'Contacted' | 'Converted' | 'Not Interested';
  link?: string;
  location: string;
  created_at: string;
};

export type Comment = {
  id: string;
  lead_id: string;
  content: string;
  created_at: string;
};