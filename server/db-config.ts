import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure websocket for Neon
neonConfig.webSocketConstructor = ws;

// Development fallback database URL (for testing only!)
const DEV_DATABASE_URL = "postgresql://peptide_dojo_owner:test123@ep-aged-forest-a5test.us-east-2.aws.neon.tech/peptide_dojo?sslmode=require";

export function createDatabase() {
  const databaseUrl = process.env.DATABASE_URL || (
    process.env.NODE_ENV === 'development' ? DEV_DATABASE_URL : null
  );

  if (!databaseUrl) {
    console.warn(`
⚠️  WARNING: No DATABASE_URL found!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To fix this:
1. Create a free database at https://console.neon.tech/
2. Add DATABASE_URL to your environment variables
3. Restart the application

Running in LIMITED MODE - some features may not work!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
    return null;
  }

  try {
    const pool = new Pool({ connectionString: databaseUrl });
    const db = drizzle({ client: pool, schema });
    
    console.log('✅ Database connected successfully!');
    return { pool, db };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return null;
  }
}

// Export singleton instance
const dbInstance = createDatabase();
export const pool = dbInstance?.pool;
export const db = dbInstance?.db;
