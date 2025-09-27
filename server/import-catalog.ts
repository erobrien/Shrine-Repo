import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { db } from './db';
import { categories, peptides } from '@shared/schema';
import { eq } from 'drizzle-orm';
import type { InsertCategory, InsertPeptide } from '@shared/schema';

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

async function importCatalog() {
  console.log('Starting catalog import...');
  
  try {
    // Read CSV file
    const csvPath = './attached_assets/woocommerce_complete_catalog_1758953826416.csv';
    const csvContent = readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records: CSVRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`Found ${records.length} products in CSV`);
    
    // Extract unique categories
    const uniqueCategories = new Set<string>();
    records.forEach(record => {
      if (record.Categories) {
        uniqueCategories.add(record.Categories);
      }
    });
    
    console.log(`Found ${uniqueCategories.size} unique categories`);
    
    // Create category map to store category IDs
    const categoryMap = new Map<string, string>();
    
    // Insert categories
    for (const categoryName of uniqueCategories) {
      const slug = generateSlug(categoryName);
      
      // Check if category already exists
      const existing = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);
      
      if (existing.length > 0) {
        console.log(`Category already exists: ${categoryName}`);
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
        
        console.log(`Created category: ${categoryName}`);
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
      
      // Check if peptide already exists
      const existing = await db
        .select()
        .from(peptides)
        .where(eq(peptides.sku, record.SKU))
        .limit(1);
      
      if (existing.length > 0) {
        console.log(`Peptide already exists: ${record.SKU} - ${record.Name}`);
        skipCount++;
        continue;
      }
      
      // Determine if it's a blend
      const isBlend = record.Categories === 'Blends' || 
                     record.Name.includes('/') || 
                     record.Name.toLowerCase().includes('blend');
      
      // Parse ingredients for blends
      const ingredients = isBlend ? parseIngredients(record.Name) : null;
      
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
      ).join(', ') || null;
      
      const peptideData: InsertPeptide = {
        name: record.Name,
        sku: record.SKU,
        categoryId: categoryId || null,
        shortDescription: record['Short description'] || null,
        description: record.Description || null,
        dosage: dosage,
        price: price.toString(),
        isBlend: isBlend,
        ingredients: ingredients,
        researchApplications: researchApplications,
        alternateNames: null
      };
      
      try {
        await db.insert(peptides).values(peptideData);
        console.log(`Imported: ${record.Name}`);
        successCount++;
      } catch (error) {
        console.error(`Failed to import ${record.Name}:`, error);
        skipCount++;
      }
    }
    
    console.log(`\n✅ Import complete!`);
    console.log(`  - Successfully imported: ${successCount} peptides`);
    console.log(`  - Skipped/Failed: ${skipCount} records`);
    console.log(`  - Total categories: ${categoryMap.size}`);
    
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the import
importCatalog();