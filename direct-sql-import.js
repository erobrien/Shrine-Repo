#!/usr/bin/env node

/**
 * Direct SQL Import - Clear and load peptides using raw SQL
 */

import pg from 'pg';
import fs from 'fs';

const { Pool } = pg;

// Database connection
const DATABASE_URL = 'postgresql://shrine_db_yzkh_user:18DobeaCbpF9ZX3jAXnaz3WIdrTXeINS@dpg-d3ceokj7mgec73aefelg-a.oregon-postgres.render.com/shrine_db_yzkh?sslmode=require';

async function directSQLImport() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  
  try {
    console.log('🚀 Direct SQL Import\n');
    
    // Step 1: Clear existing peptides
    console.log('🗑️  Clearing peptides table...');
    await pool.query('DELETE FROM peptides');
    console.log('✅ Table cleared\n');
    
    // Step 2: Load backup data
    console.log('📁 Loading peptide data...');
    const backupData = JSON.parse(fs.readFileSync('./original_peptides_backup.json', 'utf8'));
    console.log(`✅ Found ${backupData.length} peptides\n`);
    
    // Step 3: Insert all peptides
    console.log('💾 Inserting peptides...');
    let count = 0;
    
    for (const peptide of backupData) {
      const query = `
        INSERT INTO peptides (
          name, sku, sequence, description, short_description, 
          dosage, price, research_applications, is_blend,
          benefits, alternate_names, ingredients
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )
      `;
      
      const values = [
        peptide.name,
        peptide.sku,
        peptide.sequence || peptide.sku,
        peptide.description,
        peptide.shortDescription || null,
        peptide.dosage || null,
        peptide.price || '0.00',
        peptide.researchApplications || null,
        peptide.isBlend || false,
        peptide.benefits || [],
        peptide.alternateNames || [],
        peptide.ingredients || []
      ];
      
      await pool.query(query, values);
      count++;
      
      if (count % 10 === 0) {
        process.stdout.write(`\r  Progress: ${count}/${backupData.length}`);
      }
    }
    
    console.log(`\n\n✅ Import Complete! Inserted ${count} peptides`);
    
    // Verify count
    const result = await pool.query('SELECT COUNT(*) FROM peptides');
    console.log(`📊 Total peptides in database: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
  
  process.exit(0);
}

directSQLImport();
