#!/usr/bin/env node

/**
 * Simple Database Import from JSON backup
 */

import { db } from './server/db.js';
import { peptides } from '@shared/schema';
import fs from 'fs';

async function simpleImport() {
  try {
    if (!db) {
      console.error('❌ No database connection available');
      process.exit(1);
    }
    
    console.log('🚀 Simple Database Import\n');
    
    // Step 1: Clear existing peptides
    console.log('🗑️  Clearing peptides table...');
    await db.delete(peptides);
    console.log('✅ Table cleared\n');
    
    // Step 2: Load backup data
    console.log('📁 Loading backup data...');
    const backupData = JSON.parse(fs.readFileSync('./original_peptides_backup.json', 'utf8'));
    console.log(`✅ Found ${backupData.length} peptides\n`);
    
    // Step 3: Insert all peptides
    console.log('💾 Inserting peptides...');
    let count = 0;
    
    for (const peptide of backupData) {
      const insertData = {
        name: peptide.name,
        sku: peptide.sku,
        sequence: peptide.sequence || peptide.sku, // Use SKU as fallback
        description: peptide.description,
        shortDescription: peptide.shortDescription || null,
        dosage: peptide.dosage || null,
        price: peptide.price || "0.00",
        category: null,
        categoryId: null,
        researchApplications: peptide.researchApplications || null,
        isBlend: peptide.isBlend || false,
        benefits: peptide.benefits || [],
        alternateNames: peptide.alternateNames || [],
        ingredients: peptide.ingredients || []
      };
      
      await db.insert(peptides).values(insertData);
      count++;
      
      if (count % 10 === 0) {
        process.stdout.write(`\r  Progress: ${count}/${backupData.length}`);
      }
    }
    
    console.log(`\n\n✅ Import Complete! Inserted ${count} peptides`);
    
  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

simpleImport();
