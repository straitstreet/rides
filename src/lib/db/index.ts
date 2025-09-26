import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create connection with production-ready configuration
const client = postgres(process.env.DATABASE_URL, {
  max: 20, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  max_lifetime: 60 * 30, // Close connections after 30 minutes
});

// Create drizzle instance
export const db = drizzle(client, { schema });
export type DB = typeof db;