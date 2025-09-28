// Quick script to test if your deployment is working
// Run: node test-deployment.js

const baseUrl = 'https://shrine-repo-dojo.onrender.com';

async function testDeployment() {
  console.log('🧪 Testing Peptide Dojo deployment...\n');
  
  // Test 1: Health Check
  console.log('1️⃣ Testing health endpoint...');
  try {
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test 2: Peptides API
  console.log('\n2️⃣ Testing peptides API...');
  try {
    const peptidesResponse = await fetch(`${baseUrl}/api/peptides`);
    const peptidesData = await peptidesResponse.json();
    console.log(`✅ Peptides API: Found ${peptidesData.length} peptides`);
    if (peptidesData.length > 0) {
      console.log('   Sample:', peptidesData[0].name);
    }
  } catch (error) {
    console.log('❌ Peptides API failed:', error.message);
  }
  
  // Test 3: Main Page
  console.log('\n3️⃣ Testing main page...');
  try {
    const mainResponse = await fetch(baseUrl);
    console.log(`✅ Main page: Status ${mainResponse.status}`);
    console.log(`   Content-Type: ${mainResponse.headers.get('content-type')}`);
  } catch (error) {
    console.log('❌ Main page failed:', error.message);
  }
  
  console.log('\n🏁 Test complete!');
}

// Run the test
testDeployment();
