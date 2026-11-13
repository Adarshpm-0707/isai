/**
 * Data sync service.
 * Database is connected live to Supabase.
 * Local files are not written during runtime to prevent Vite HMR auto-refresh loops.
 */

export async function syncLocalhostData() {
  // No-op: Supabase is the single source of truth.
  // Disk writes to src/data/ are disabled to prevent Vite dev server reload loops.
}

