import { db } from './db';
import { guides } from '@shared/schema';
import { sanitizeAndNormalizeContent } from './content-sanitizer';
import { eq } from 'drizzle-orm';

async function normalizeAllGuides() {
  console.log('Starting guide normalization process...');
  
  try {
    // Fetch all guides from the database
    const allGuides = await db.select().from(guides);
    const totalGuides = allGuides.length;
    
    console.log(`Found ${totalGuides} guides to normalize`);
    
    if (totalGuides === 0) {
      console.log('No guides found in the database');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ id: string; title: string; error: string }> = [];
    
    // Process each guide
    for (let i = 0; i < allGuides.length; i++) {
      const guide = allGuides[i];
      const progress = i + 1;
      
      try {
        console.log(`Normalizing guide ${progress}/${totalGuides}: "${guide.title}"`);
        
        // Sanitize and normalize the content
        const normalizedContent = sanitizeAndNormalizeContent(guide.content, true);
        
        // Update the guide in the database with normalized content
        await db
          .update(guides)
          .set({ 
            content: normalizedContent,
            lastUpdated: new Date() 
          })
          .where(eq(guides.id, guide.id));
        
        successCount++;
        console.log(`  ✓ Successfully normalized guide: "${guide.title}"`);
      } catch (error) {
        errorCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          id: guide.id,
          title: guide.title,
          error: errorMessage
        });
        console.error(`  ✗ Error normalizing guide "${guide.title}": ${errorMessage}`);
      }
    }
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('NORMALIZATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`Total guides processed: ${totalGuides}`);
    console.log(`Successfully normalized: ${successCount}`);
    console.log(`Errors encountered: ${errorCount}`);
    
    if (errors.length > 0) {
      console.log('\nGuides with errors:');
      errors.forEach(({ id, title, error }) => {
        console.log(`  - ${title} (ID: ${id})`);
        console.log(`    Error: ${error}`);
      });
    }
    
    console.log('\nAll guides have been processed and updated with:');
    console.log('  - Properly structured HTML headings');
    console.log('  - Normalized lists (ul/ol)');
    console.log('  - Properly wrapped paragraphs');
    console.log('  - Product links with correct attributes');
    console.log('  - Formatted citations and references');
    
  } catch (error) {
    console.error('Fatal error during normalization:', error);
    process.exit(1);
  }
}

// Run the normalization
normalizeAllGuides()
  .then(() => {
    console.log('\n✅ Normalization script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Normalization script failed:', error);
    process.exit(1);
  });