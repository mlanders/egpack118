import { Pool } from "pg";
import fs from "fs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  
  try {
    // Read the migration file
    const migrationSQL = fs.readFileSync(
      'prisma/migrations/20260112030127_add_better_auth_tables/migration.sql',
      'utf-8'
    );
    
    console.log("Running migration SQL...");
    await client.query(migrationSQL);
    console.log("Migration completed successfully!");
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('users', 'sessions', 'accounts')
      ORDER BY table_name;
    `);
    
    console.log("\nCreated tables:", result.rows.map(r => r.table_name));
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
