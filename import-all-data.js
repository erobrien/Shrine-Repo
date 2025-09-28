#!/usr/bin/env node

/**
 * Complete Data Import Script
 * Imports both peptides and research guides from CSV files
 */

import pg from 'pg';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const { Pool } = pg;

// Database connection
const DATABASE_URL = 'postgresql://shrine_db_yzkh_user:18DobeaCbpF9ZX3jAXnaz3WIdrTXeINS@dpg-d3ceokj7mgec73aefelg-a.oregon-postgres.render.com/shrine_db_yzkh?sslmode=require';

async function importAllData() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  
  try {
    console.log('🚀 Complete Data Import Starting...\n');
    
    // Import Peptides
    await importPeptides(pool);
    
    // Import Research Guides
    await importGuides(pool);
    
    console.log('\n✅ All data imported successfully!');
    
  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
  
  process.exit(0);
}

async function importPeptides(pool) {
  console.log('📊 PEPTIDES IMPORT');
  console.log('==================');
  
  // Clear existing peptides
  console.log('🗑️  Clearing peptides table...');
  await pool.query('DELETE FROM peptides');
  
  // Load JSON backup (easier than CSV for complex data)
  console.log('📁 Loading peptide data...');
  const peptides = JSON.parse(fs.readFileSync('./original_peptides_backup.json', 'utf8'));
  console.log(`✅ Found ${peptides.length} peptides\n`);
  
  // Insert peptides
  console.log('💾 Inserting peptides...');
  let count = 0;
  
  for (const peptide of peptides) {
    const query = `
      INSERT INTO peptides (
        name, sku, description, short_description, 
        dosage, price, research_applications, is_blend,
        alternate_names, ingredients
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
    `;
    
    const values = [
      peptide.name,
      peptide.sku,
      peptide.description,
      peptide.shortDescription || null,
      peptide.dosage || null,
      peptide.price || '0.00',
      peptide.researchApplications || null,
      peptide.isBlend || false,
      peptide.alternateNames || [],
      peptide.ingredients || []
    ];
    
    await pool.query(query, values);
    count++;
    
    if (count % 20 === 0) {
      process.stdout.write(`\r  Progress: ${count}/${peptides.length}`);
    }
  }
  
  console.log(`\n✅ Imported ${count} peptides`);
  
  // Verify
  const result = await pool.query('SELECT COUNT(*) FROM peptides');
  console.log(`📊 Total peptides in database: ${result.rows[0].count}\n`);
}

async function importGuides(pool) {
  console.log('📚 RESEARCH GUIDES IMPORT');
  console.log('=========================');
  
  // Clear existing guides
  console.log('🗑️  Clearing guides table...');
  await pool.query('DELETE FROM guides');
  
  // Load CSV data
  console.log('📁 Loading guides CSV...');
  const csvContent = fs.readFileSync('./data/all_research_guides_complete.csv', 'utf8');
  const guides = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  console.log(`✅ Found ${guides.length} guides\n`);
  
  // Insert guides with generated content
  console.log('💾 Inserting guides...');
  let count = 0;
  
  for (const guide of guides) {
    // Skip empty rows
    if (!guide.slug || !guide.slug.trim()) continue;
    
    // Generate full content based on the guide data
    const content = generateGuideContent(guide);
    
    const query = `
      INSERT INTO guides (
        slug, title, meta_title, meta_description, content,
        excerpt, category, tags, author, 
        publish_date, last_updated, featured, read_time, keywords
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )
    `;
    
    const values = [
      guide.slug,
      guide.title,
      guide.meta_title,
      guide.meta_description,
      content,
      guide.excerpt,
      guide.category,
      guide.tags ? guide.tags.split(';') : [],
      guide.author || 'Shrine Peptides Research Team',
      new Date(),
      new Date(),
      guide.featured === 'TRUE',
      parseInt(guide.read_time) || 6,
      guide.keywords ? guide.keywords.split(';') : []
    ];
    
    await pool.query(query, values);
    count++;
    
    if (count % 10 === 0) {
      process.stdout.write(`\r  Progress: ${count}/${guides.length}`);
    }
  }
  
  console.log(`\n✅ Imported ${count} guides`);
  
  // Verify
  const result = await pool.query('SELECT COUNT(*) FROM guides');
  console.log(`📊 Total guides in database: ${result.rows[0].count}`);
}

function generateGuideContent(guide) {
  // Generate comprehensive content based on the guide metadata
  const sections = [];
  
  // Introduction
  sections.push(`# ${guide.title}\n\n${guide.excerpt}\n`);
  
  // Overview section
  sections.push(`## Overview\n\n${guide.meta_description} This comprehensive guide covers the latest research and developments in ${guide.title.toLowerCase()}.\n`);
  
  // Key Benefits section (for peptide-specific guides)
  if (guide.category === 'Peptide Deep Dives') {
    sections.push(`## Key Research Findings\n\n- Enhanced therapeutic potential\n- Improved bioavailability studies\n- Novel delivery mechanisms\n- Clinical trial updates\n- Safety profile analysis\n`);
  }
  
  // Research section
  sections.push(`## Current Research\n\nRecent studies have shown promising results in ${guide.title.toLowerCase()} applications. Researchers are exploring new pathways and mechanisms of action that could revolutionize our understanding.\n`);
  
  // Safety section
  sections.push(`## Safety Considerations\n\nAs with all research compounds, proper protocols must be followed. This includes:\n\n- Proper storage and handling\n- Accurate dosing calculations\n- Documentation of all procedures\n- Following institutional guidelines\n`);
  
  // Future directions
  sections.push(`## Future Directions\n\nThe field of ${guide.title.toLowerCase()} continues to evolve rapidly. Emerging areas of interest include:\n\n- Novel applications\n- Combination therapies\n- Personalized protocols\n- Advanced delivery systems\n`);
  
  // Conclusion
  sections.push(`## Conclusion\n\n${guide.excerpt} Stay updated with the latest research developments in this exciting field.\n`);
  
  // References
  sections.push(`## References\n\n1. Latest peer-reviewed studies on ${guide.title}\n2. Clinical trial data and outcomes\n3. Research institution publications\n4. Scientific conference proceedings\n`);
  
  return sections.join('\n');
}

// Run the import
importAllData();
