import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database configuration
let db: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof postgres> | null = null;

// Initialize database connection
function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not configured - database operations will fail');
    return null;
  }

  try {
    // Create connection with production-ready configuration
    client = postgres(process.env.DATABASE_URL, {
      max: 20, // Maximum number of connections
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout in seconds
      max_lifetime: 60 * 30, // Close connections after 30 minutes
    });

    // Create drizzle instance
    return drizzle(client, { schema });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return null;
  }
}

// Initialize the database
db = initializeDatabase();

// Export the database instance
export { db };
export type DB = typeof db;

// Export a function to get database or throw error
export function getDatabase() {
  if (!db) {
    throw new Error('Database not configured - set DATABASE_URL environment variable');
  }
  return db;
}

// Close database connection (for cleanup)
export function closeDatabase() {
  if (client) {
    client.end();
    client = null;
    db = null;
  }
}