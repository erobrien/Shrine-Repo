import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure websocket for Neon
neonConfig.webSocketConstructor = ws;

// Only initialize database if DATABASE_URL is present
let pool: Pool | undefined;
let db: ReturnType<typeof drizzle> | undefined;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log('🗄️  Database connection initialized');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
  }
} else {
  console.log('📦 Running without database (DATABASE_URL not set)');
}

export { pool, db };