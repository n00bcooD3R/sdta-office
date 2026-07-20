import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || '';

export const isNeonConfigured = Boolean(
  DATABASE_URL && 
  !DATABASE_URL.includes('your_neon_password') && 
  !DATABASE_URL.includes('ep-sample-12345')
);

// Lazy SQL client generator
export function getSql() {
  if (!isNeonConfigured) {
    return null;
  }
  try {
    return neon(DATABASE_URL);
  } catch (err) {
    console.warn("Neon SQL init warning, using mock database fallback:", err);
    return null;
  }
}
