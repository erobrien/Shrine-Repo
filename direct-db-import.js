#!/usr/bin/env node

/**
 * Direct Database Import - Simple ETL for CSV to peptides table
 */

import { db } from './server/db.js';
import { peptides } from '@shared/schema';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

async function clearAndImportPeptides() {
  try {
    console.log('🚀 Direct Database Import Starting...\n');
    
    // Step 1: Clear existing peptides
    console.log('🗑️  Clearing existing peptides table...');
    const deleteResult = await db.delete(peptides);
    console.log('✅ Peptides table cleared\n');
    
    // Step 2: Read CSV data
    console.log('📁 Reading CSV file...');
    const csvContent = fs.readFileSync('./data/all_peptides_complete.csv', 'utf8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    console.log(`✅ Found ${records.length} records in CSV\n`);
    
    // Step 3: Transform and insert each record
    console.log('💾 Inserting peptides into database...');
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      // Skip empty records
      if (!record.name || !record.name.trim()) {
        continue;
      }
      
      try {
        // Transform CSV record to database format
        const peptideData = {
          name: record.name,
          sku: record.sku,
          sequence: record.sku, // Using SKU as sequence since we don't have sequences in CSV
          description: record.description,
          shortDescription: record.short_description || null,
          dosage: record.dosage || null,
          price: record.price || "0.00",
          category: null, // We'll handle categories separately
          categoryId: null, // Clear category reference for now
          researchApplications: record.research_applications || null,
          isBlend: record.is_blend === 'true',
          benefits: [], // Clear benefits array
          alternateNames: record.alternate_names ? 
            record.alternate_names.split(';').map(n => n.trim()).filter(n => n) : [],
          ingredients: record.ingredients ? 
            record.ingredients.split(';').map(i => i.trim()).filter(i => i) : []
        };
        
        // Insert into database
        await db.insert(peptides).values(peptideData);
        successCount++;
        
        if ((i + 1) % 10 === 0) {
          console.log(`  Progress: ${i + 1}/${records.length} (${Math.round((i + 1) / records.length * 100)}%)`);
        }
        
      } catch (error) {
        errorCount++;
        console.error(`  ❌ Error importing ${record.name}: ${error.message}`);
      }
    }
    
    console.log('\n✅ Import Complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Total records: ${records.length}`);
    console.log(`   - Successful imports: ${successCount}`);
    console.log(`   - Failed imports: ${errorCount}`);
    
    // Verify final count
    const finalCount = await db.select().from(peptides);
    console.log(`   - Peptides in database: ${finalCount.length}`);
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the import
clearAndImportPeptides();
