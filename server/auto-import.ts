import { readFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { db } from './db';
import { categories, peptides, guides } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';
import type { InsertCategory, InsertPeptide } from '@shared/schema';
import { generateAllGuides } from './generate-guides';

// Type for CSV row
interface CSVRow {
  ID: string;
  Type: string;
  SKU: string;
  Name: string;
  Published: string;
  'Is featured?': string;
  'Visibility in catalog': string;
  'Short description': string;
  Description: string;
  'Date sale price starts': string;
  'Date sale price ends': string;
  'Tax status': string;
  'Tax class': string;
  'In stock?': string;
  Stock: string;
  'Low stock amount': string;
  'Backorders allowed?': string;
  'Sold individually?': string;
  'Weight (kg)': string;
  'Length (cm)': string;
  'Width (cm)': string;
  'Height (cm)': string;
  'Allow customer reviews?': string;
  'Purchase note': string;
  'Sale price': string;
  'Regular price': string;
  Categories: string;
  Tags: string;
  'Shipping class': string;
  Images: string;
  'Download limit': string;
  'Download expiry days': string;
  Parent: string;
  'Grouped products': string;
  Upsells: string;
  'Cross-sells': string;
  'External URL': string;
  'Button text': string;
  Position: string;
}

// Helper function to parse dosage from name
function parseDosage(name: string): string | null {
  const matches = name.match(/\(([^)]+)\)/g);
  if (matches && matches.length > 0) {
    return matches.map(m => m.slice(1, -1)).join(', ');
  }
  return null;
}

// Helper function to extract ingredients from blend names
function parseIngredients(name: string): string[] | null {
  // Check if it's a blend by looking for multiple components separated by "/"
  const parts = name.split('/').map(p => p.trim());
  
  if (parts.length > 1) {
    // Extract just the peptide names with dosages
    return parts.map(part => {
      // Remove any leading blend names or numbers
      const cleanPart = part.replace(/^(2X |4X |GLOW |KLOW |Wolverine Blend - )/i, '').trim();
      return cleanPart;
    });
  }
  
  return null;
}

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function checkAndImportPeptides(): Promise<boolean> {
  try {
    console.log('🔍 Checking if peptides exist in database...');
    
    // Check if peptides table has any data
    const existingPeptides = await db.select().from(peptides).limit(1);
    
    if (existingPeptides.length > 0) {
      console.log('✅ Peptides already exist in database. Skipping import.');
      return false;
    }
    
    console.log('⚠️  No peptides found in database. Starting automatic import...');
    
    // Check if CSV file exists
    const csvPath = './attached_assets/woocommerce_complete_catalog_1758953826416.csv';
    
    if (!existsSync(csvPath)) {
      console.error('❌ CSV file not found at:', csvPath);
      console.error('Please ensure the catalog CSV file is available at the expected location.');
      return false;
    }
    
    console.log('📁 CSV file found. Starting import process...');
    
    // Read and parse CSV
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records: CSVRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`📊 Found ${records.length} products in CSV`);
    
    // Extract unique categories
    const uniqueCategories = new Set<string>();
    records.forEach(record => {
      if (record.Categories) {
        uniqueCategories.add(record.Categories);
      }
    });
    
    console.log(`📂 Found ${uniqueCategories.size} unique categories`);
    
    // Create category map to store category IDs
    const categoryMap = new Map<string, string>();
    
    // Insert categories
    for (const categoryName of Array.from(uniqueCategories)) {
      const slug = generateSlug(categoryName);
      
      // Check if category already exists
      const existing = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);
      
      if (existing.length > 0) {
        categoryMap.set(categoryName, existing[0].id);
      } else {
        const categoryData: InsertCategory = {
          name: categoryName,
          slug: slug,
          description: `Research peptides in the ${categoryName} category`
        };
        
        const [newCategory] = await db
          .insert(categories)
          .values(categoryData)
          .returning();
        
        console.log(`  ✓ Created category: ${categoryName}`);
        categoryMap.set(categoryName, newCategory.id);
      }
    }
    
    // Insert peptides
    let successCount = 0;
    let skipCount = 0;
    
    for (const record of records) {
      // Skip if no SKU or empty record
      if (!record.SKU || !record.Name) {
        skipCount++;
        continue;
      }
      
      // Check if peptide already exists (should not happen in empty DB, but being safe)
      const existing = await db
        .select()
        .from(peptides)
        .where(eq(peptides.sku, record.SKU))
        .limit(1);
      
      if (existing.length > 0) {
        skipCount++;
        continue;
      }
      
      // Determine if it's a blend
      const isBlend = record.Categories === 'Blends' || 
                     record.Name.includes('/') || 
                     record.Name.toLowerCase().includes('blend');
      
      // Parse ingredients for blends
      const ingredients = isBlend ? parseIngredients(record.Name) : undefined;
      
      // Parse dosage
      const dosage = parseDosage(record.Name);
      
      // Parse price (remove any non-numeric characters except decimal)
      const priceStr = record['Regular price'].replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr) || 0;
      
      // Get category ID
      const categoryId = record.Categories ? categoryMap.get(record.Categories) : null;
      
      // Extract research applications from tags
      const tags = record.Tags ? record.Tags.split(',').map(t => t.trim()) : [];
      const researchApplications = tags.filter(tag => 
        !tag.includes('mg') && 
        !tag.includes('mcg') &&
        !tag.includes('peptide') &&
        !tag.includes('research chemicals')
      ).join(', ') || undefined;
      
      const peptideData: InsertPeptide = {
        name: record.Name,
        sku: record.SKU,
        categoryId: categoryId || null,
        shortDescription: record['Short description'] || null,
        description: record.Description || null,
        dosage: dosage,
        price: price.toString(),
        isBlend: isBlend,
        ingredients: ingredients || undefined,
        researchApplications: researchApplications,
        alternateNames: undefined
      };
      
      try {
        await db.insert(peptides).values(peptideData);
        successCount++;
        // Log progress every 10 peptides
        if (successCount % 10 === 0) {
          console.log(`  ⏳ Imported ${successCount} peptides...`);
        }
      } catch (error) {
        console.error(`  ⚠️  Failed to import ${record.Name}:`, error);
        skipCount++;
      }
    }
    
    console.log('\n🎉 AUTOMATIC IMPORT COMPLETE!');
    console.log(`  ✅ Successfully imported: ${successCount} peptides`);
    console.log(`  ⏩ Skipped/Failed: ${skipCount} records`);
    console.log(`  📂 Total categories: ${categoryMap.size}`);
    
    return true;
  } catch (error) {
    console.error('❌ AUTOMATIC IMPORT FAILED:', error);
    console.error('The application will continue, but no peptides will be available.');
    return false;
  }
}

// Check if guides exist in database, if not, generate them
async function checkAndImportGuides(): Promise<boolean> {
  try {
    console.log('🔍 Checking if guides exist in database...');
    
    // Check if guides already exist - use count for more efficient query
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(guides);
    
    console.log(`📊 Found ${count} existing guides in database.`);
    
    if (count > 0) {
      console.log('✅ Guides already exist in database. Skipping import.');
      return false;
    }
    
    console.log('📚 No guides found. Generating comprehensive research guides...');
    console.log('⏳ This may take a moment to generate 111+ research articles...');
    
    // Generate all guides using the existing script
    await generateAllGuides();
    
    // Verify guides were created
    const [{ newCount }] = await db
      .select({ newCount: sql<number>`count(*)` })
      .from(guides);
    
    console.log(`✅ Research guides generated successfully! Total guides: ${newCount}`);
    return true;
  } catch (error: any) {
    // If error is about duplicate guides, that's actually OK - guides exist
    if (error?.code === '23505' && error?.constraint === 'guides_slug_unique') {
      console.log('✅ Guides already exist in database (detected via constraint).');
      return false;
    }
    
    console.error('⚠️  Warning: Failed to check/import guides:', error);
    console.error('The application will continue, but no research guides will be available.');
    return false;
  }
}

export { checkAndImportPeptides, checkAndImportGuides };