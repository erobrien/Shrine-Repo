// Test Render deployment
const url = 'https://shrine-repo-dojo.onrender.com/api/health';

console.log('Testing Render deployment...');
console.log('URL:', url);

fetch(url)
  .then(response => {
    console.log('\nStatus:', response.status);
    console.log('Status Text:', response.statusText);
    return response.text();
  })
  .then(text => {
    console.log('\nResponse:');
    console.log(text);
    
    // Try to parse as JSON
    try {
      const json = JSON.parse(text);
      console.log('\nParsed JSON:', json);
    } catch (e) {
      console.log('(Not valid JSON)');
    }
  })
  .catch(error => {
    console.error('\nError:', error.message);
  });
