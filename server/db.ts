import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Only initialize database if DATABASE_URL is present
let pool: Pool | undefined;
let db: ReturnType<typeof drizzle> | undefined;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum connections
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
      connectionTimeoutMillis: 2000, // Timeout after 2 seconds
    });
    db = drizzle({ client: pool, schema });
    console.log('🗄️  Database connection initialized with PostgreSQL driver');
    
    // Test connection
    pool.query('SELECT 1').then(() => {
      console.log('✅ Database connection test successful');
    }).catch((error) => {
      console.error('❌ Database connection test failed:', error);
    });
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
  }
} else {
  console.log('📦 Running without database (DATABASE_URL not set)');
}

export { pool, db };