import { createClient } from '@supabase/supabase-js';

const getValidEnvUrl = () => {
  const viteUrl = import.meta.env.VITE_SUPABASE_URL;
  if (viteUrl && !viteUrl.includes('your-project-ref')) return viteUrl;
  const nextUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  if (nextUrl && !nextUrl.includes('your-project-ref')) return nextUrl;
  return "https://kxbjohyokjqxzeoysgsd.supabase.co";
};

const getValidEnvKey = () => {
  const viteKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (viteKey && !viteKey.includes('your-supabase-anon-key')) return viteKey;
  const nextKey = import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (nextKey && !nextKey.includes('your-supabase-anon-key')) return nextKey;
  return "sb_publishable_7xUtsSORFtgISicn3VDNIQ_jhEyivcW";
};

const supabaseUrl = getValidEnvUrl();
const supabaseAnonKey = getValidEnvKey();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
