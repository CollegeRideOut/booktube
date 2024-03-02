import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required.');
}

export default {
  schema: './src/schema.ts',
  out: './src/migrations',
  driver: 'mysql2',
  dbCredentials: {
    uri: process.env.DATABASE_URL,
  },
} satisfies Config;
