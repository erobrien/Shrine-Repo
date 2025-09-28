#!/usr/bin/env node

/**
 * Re-import all peptides to database storage
 */

import fs from 'fs';

const NEW_API = 'https://shrine-repo-dojo.onrender.com/api/peptides';

function transformPeptideData(originalPeptide) {
  // Transform original peptide structure to match our exact schema
  const transformed = {
    name: originalPeptide.name,
    sku: originalPeptide.sku,
    description: originalPeptide.description,
    price: originalPeptide.price || "0.00",
    isBlend: originalPeptide.isBlend || false
  };

  // Add optional fields only if they have values (not null)
  if (originalPeptide.alternateNames && Array.isArray(originalPeptide.alternateNames)) {
    transformed.alternateNames = originalPeptide.alternateNames;
  }
  
  if (originalPeptide.ingredients && Array.isArray(originalPeptide.ingredients)) {
    transformed.ingredients = originalPeptide.ingredients;
  }
  
  if (originalPeptide.shortDescription) {
    transformed.shortDescription = originalPeptide.shortDescription;
  }
  
  if (originalPeptide.dosage) {
    transformed.dosage = originalPeptide.dosage;
  }
  
  if (originalPeptide.researchApplications) {
    transformed.researchApplications = originalPeptide.researchApplications;
  }

  return transformed;
}

async function importPeptides(peptides) {
  console.log(`🚀 Re-importing ${peptides.length} peptides to database...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < peptides.length; i++) {
    const originalPeptide = peptides[i];
    const transformedPeptide = transformPeptideData(originalPeptide);
    
    try {
      console.log(`📤 Importing ${i + 1}/${peptides.length}: ${originalPeptide.name}`);
      
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
  
  console.log(`\n🎯 Re-import Summary:`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📊 Total: ${peptides.length}`);
}

async function main() {
  try {
    console.log('🔄 Re-importing Peptides to Database Storage');
    console.log('==========================================');
    
    // Load from backup file
    if (fs.existsSync('./original_peptides_backup.json')) {
      console.log('📁 Loading peptides from backup...');
      const backupData = fs.readFileSync('./original_peptides_backup.json', 'utf8');
      const originalPeptides = JSON.parse(backupData);
      console.log(`✅ Loaded ${originalPeptides.length} peptides from backup`);
      
      // Import to database
      await importPeptides(originalPeptides);
      
      console.log('\n🎉 Re-import completed!');
      console.log('🌐 Visit: https://shrine-repo-dojo.onrender.com/peptides');
    } else {
      console.error('❌ Backup file not found. Need to re-download from original site.');
      
      // Re-download from original
      console.log('🔄 Re-downloading from original site...');
      const response = await fetch('https://peptidedojo.com/api/peptides');
      if (!response.ok) {
        throw new Error(`Failed to fetch from original: ${response.status}`);
      }
      
      const peptides = await response.json();
      console.log(`✅ Downloaded ${peptides.length} peptides`);
      
      // Save backup
      fs.writeFileSync('./original_peptides_backup.json', JSON.stringify(peptides, null, 2));
      
      // Import to database
      await importPeptides(peptides);
      
      console.log('\n🎉 Download and import completed!');
    }
    
  } catch (error) {
    console.error('💥 Re-import failed:', error);
    process.exit(1);
  }
}

// Run the re-import
main();
