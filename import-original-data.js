#!/usr/bin/env node

/**
 * Import Script: Migrate all peptides from original peptidedojo.com to new Render deployment
 * This script fetches all peptides from the original API and imports them to our new system
 */

import fs from 'fs';
import path from 'path';

const ORIGINAL_API = 'https://peptidedojo.com/api/peptides';
const NEW_API = 'https://shrine-repo-dojo.onrender.com/api/peptides';

async function fetchOriginalData() {
  console.log('🔄 Fetching peptides from original site...');
  
  try {
    const response = await fetch(ORIGINAL_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const peptides = await response.json();
    console.log(`✅ Found ${peptides.length} peptides from original site`);
    
    // Save to local file for backup
    fs.writeFileSync('./original_peptides_backup.json', JSON.stringify(peptides, null, 2));
    console.log('💾 Saved backup to original_peptides_backup.json');
    
    return peptides;
  } catch (error) {
    console.error('❌ Error fetching original data:', error);
    throw error;
  }
}

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

function generateSequenceFromName(name) {
  // For peptides without sequences, generate placeholder based on known peptides
  const knownSequences = {
    'BPC-157': 'GEPPPGKPADDAGLV',
    'TB-500': 'LKKTETQ',
    'Body Protective Compound 157': 'GEPPPGKPADDAGLV',
    'Thymosin Beta-4': 'LKKTETQ'
  };
  
  return knownSequences[name] || null;
}

function extractBenefitsFromDescription(description) {
  if (!description) return [];
  
  // Extract key benefits from description text
  const benefitKeywords = [
    'tissue repair', 'healing', 'recovery', 'muscle growth', 
    'performance enhancement', 'cognitive enhancement', 'neuroprotection',
    'fat loss', 'weight management', 'anti-inflammatory', 'gut health',
    'wound healing', 'flexibility', 'libido', 'sexual function'
  ];
  
  const benefits = [];
  const lowerDesc = description.toLowerCase();
  
  benefitKeywords.forEach(keyword => {
    if (lowerDesc.includes(keyword)) {
      benefits.push(keyword);
    }
  });
  
  return benefits.length > 0 ? benefits : ['Research applications'];
}

function mapCategoryFromResearchApplications(researchApps) {
  if (!researchApps) return 'General';
  
  const apps = researchApps.toLowerCase();
  
  if (apps.includes('brain') || apps.includes('cognitive') || apps.includes('nootropic')) {
    return 'Brain & Mood';
  }
  if (apps.includes('fitness') || apps.includes('performance') || apps.includes('muscle')) {
    return 'Fitness & Performance';
  }
  if (apps.includes('recovery') || apps.includes('healing') || apps.includes('tissue repair')) {
    return 'Recovery';
  }
  if (apps.includes('sexual') || apps.includes('libido')) {
    return 'Sexual Health';
  }
  if (apps.includes('weight') || apps.includes('fat loss')) {
    return 'Weight Management';
  }
  
  return 'General Health';
}

async function importPeptides(peptides) {
  console.log(`🚀 Starting import of ${peptides.length} peptides...`);
  
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
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      errorCount++;
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
  
  console.log(`\n🎯 Import Summary:`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📊 Total: ${peptides.length}`);
}

async function main() {
  try {
    console.log('🚀 Starting Peptide Dojo Data Migration');
    console.log('=====================================');
    
    let originalPeptides;
    
    // Try to use existing backup first
    if (fs.existsSync('./original_peptides_backup.json')) {
      console.log('📁 Using existing backup file...');
      const backupData = fs.readFileSync('./original_peptides_backup.json', 'utf8');
      originalPeptides = JSON.parse(backupData);
      console.log(`✅ Loaded ${originalPeptides.length} peptides from backup`);
    } else {
      // Step 1: Fetch original data
      originalPeptides = await fetchOriginalData();
    }
    
    // Step 2: Import to new system
    await importPeptides(originalPeptides);
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('🌐 Visit: https://shrine-repo-dojo.onrender.com/peptides');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
main();
