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
    await page.goto('https://shrine-repo-dojo.onrender.com/peptides');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'peptides-page.png', fullPage: true });
    console.log('📸 Screenshot saved: peptides-page.png');
    
    // Check for peptide cards
    const peptideCards = await page.locator('[data-testid="peptide-card"], .peptide-card, [class*="peptide"]').count();
    console.log(`🔬 Found ${peptideCards} peptide cards`);
    
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
    const guideCards = await page.locator('[data-testid="guide-card"], .guide-card, [class*="guide"]').count();
    console.log(`📖 Found ${guideCards} guide cards`);
    
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
