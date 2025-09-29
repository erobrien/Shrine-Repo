import { chromium } from 'playwright';

async function testSite() {
  console.log('🎭 Starting visual test...');
  
  const browser = await chromium.launch({ 
    headless: false, // Show browser for visual inspection
    slowMo: 1000 // Slow down for better observation
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Test peptides page
    console.log('📱 Testing peptides page...');
    
    // Listen to console logs
    page.on('console', msg => {
      if (msg.text().includes('🧪') || msg.text().includes('🎯') || msg.text().includes('📊')) {
        console.log('🖥️ Browser:', msg.text());
      }
    });
    
    await page.goto('https://shrine-repo-dojo.onrender.com/peptides');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for React to fully load
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: 'peptides-page.png', fullPage: true });
    console.log('📸 Screenshot saved: peptides-page.png');
    
    // Check for specific peptide cards with correct data-testid
    const peptideCards = await page.locator('[data-testid^="card-peptide-"]').count();
    console.log(`🔬 Found ${peptideCards} peptide cards`);
    
    // Check for research guide cards (wrong component)
    const guideCards = await page.locator('[data-testid^="card-guide-"]').count();
    console.log(`📚 Found ${guideCards} research guide cards on peptides page (should be 0)`);
    
    // Check page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Check for "Peptide Library" heading
    const peptideHeading = await page.locator('h1:has-text("Peptide Library")').count();
    console.log(`🏷️ Found ${peptideHeading} "Peptide Library" headings`);
    
    // Check for "All Guides" text (indicates wrong component)
    const allGuidesText = await page.locator('text="All Guides"').count();
    console.log(`📖 Found ${allGuidesText} "All Guides" text (should be 0 on peptides page)`);
    
    // Check for any error messages
    const errorMessages = await page.locator('text="error"i, text="failed"i, text="loading"i').count();
    console.log(`❌ Found ${errorMessages} potential error messages`);
    
    // Test research page
    console.log('📚 Testing research page...');
    await page.goto('https://shrine-repo-dojo.onrender.com/research');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'research-page.png', fullPage: true });
    console.log('📸 Screenshot saved: research-page.png');
    
    // Check for research guide cards
    const researchGuideCards = await page.locator('[data-testid="guide-card"], .guide-card, [class*="guide"]').count();
    console.log(`📖 Found ${researchGuideCards} guide cards`);
    
    // Check API endpoints directly
    console.log('🔌 Testing API endpoints...');
    
    const peptidesResponse = await page.request.get('https://shrine-repo-dojo.onrender.com/api/peptides');
    console.log(`🧬 Peptides API status: ${peptidesResponse.status()}`);
    
    const guidesResponse = await page.request.get('https://shrine-repo-dojo.onrender.com/api/guides');
    console.log(`📚 Guides API status: ${guidesResponse.status()}`);
    
    // Get page content for debugging
    const peptidesContent = await page.locator('body').textContent();
    console.log('📄 Peptides page content preview:', peptidesContent.substring(0, 500));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
    console.log('✅ Visual test completed');
  }
}

testSite().catch(console.error);
