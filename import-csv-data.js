#!/usr/bin/env node

/**
 * Import Script: Load all peptides from CSV file to database
 */

import fs from 'fs';
import { parse } from 'csv-parse/sync';

const NEW_API = 'https://shrine-repo-dojo.onrender.com/api/peptides';

function transformCSVPeptide(csvRow) {
  // Transform CSV row to match our schema
  const transformed = {
    name: csvRow.name,
    sku: csvRow.sku,
    description: csvRow.description,
    price: csvRow.price || "0.00",
    isBlend: csvRow.is_blend === 'true'
  };

  // Add optional fields only if they have values
  if (csvRow.short_description && csvRow.short_description.trim()) {
    transformed.shortDescription = csvRow.short_description;
  }
  
  if (csvRow.dosage && csvRow.dosage.trim()) {
    transformed.dosage = csvRow.dosage;
  }
  
  if (csvRow.research_applications && csvRow.research_applications.trim()) {
    transformed.researchApplications = csvRow.research_applications;
  }

  // Handle alternate names array
  if (csvRow.alternate_names && csvRow.alternate_names.trim()) {
    transformed.alternateNames = csvRow.alternate_names.split(';').map(name => name.trim()).filter(name => name);
  }

  // Handle ingredients array
  if (csvRow.ingredients && csvRow.ingredients.trim()) {
    transformed.ingredients = csvRow.ingredients.split(';').map(ingredient => ingredient.trim()).filter(ingredient => ingredient);
  }

  return transformed;
}

async function importPeptidesFromCSV() {
  try {
    console.log('🚀 Loading peptides from CSV file...');
    
    // Read and parse CSV
    const csvContent = fs.readFileSync('./data/all_peptides_complete.csv', 'utf8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`✅ Found ${records.length} peptides in CSV`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < records.length; i++) {
      const csvRow = records[i];
      
      // Skip empty rows
      if (!csvRow.name || !csvRow.name.trim()) {
        continue;
      }
      
      const transformedPeptide = transformCSVPeptide(csvRow);
      
      try {
        console.log(`📤 Importing ${i + 1}/${records.length}: ${csvRow.name}`);
        
        const response = await fetch(NEW_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transformedPeptide)
        });
        
        if (response.ok) {
          successCount++;
          console.log(`  ✅ Success`);
        } else {
          errorCount++;
          const error = await response.text();
          console.log(`  ❌ Failed: ${response.status} - ${error}`);
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        errorCount++;
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
    
    console.log(`\n🎯 CSV Import Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📊 Total: ${records.length}`);
    
  } catch (error) {
    console.error('💥 CSV import failed:', error);
    process.exit(1);
  }
}

// Run the import
importPeptidesFromCSV();
