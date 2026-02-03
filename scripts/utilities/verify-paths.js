const fs = require('fs');

const tests = ['jft-basic-1', 'jft-basic-2', 'jft-basic-3', 'jft-basic-4'];

tests.forEach(test => {
  const file = `tests/${test}/${test}-data.js`;
  const content = fs.readFileSync(file, 'utf8');
  
  console.log(`\n✓ ${test}:`);
  
  // Check for old paths
  if (content.includes('../../data/images/')) {
    console.log('  ❌ Still has old data/images paths');
  } else {
    console.log('  ✅ All paths use /images/ (no data folder)');
  }
  
  // Check for correct folder names with spaces
  if (content.includes('jft basic test')) {
    console.log('  ✅ Folder names have correct spacing');
  } else {
    console.log('  ❌ Folder names need spacing');
  }
  
  // Check for .png extension
  const jpgCount = (content.match(/\.jpg/g) || []).length;
  if (jpgCount === 0) {
    console.log('  ✅ All images use .png extension');
  } else {
    console.log(`  ❌ Found ${jpgCount} .jpg references`);
  }
  
  // Sample a line
  const match = content.match(/image: '[^']+'/);
  if (match) {
    console.log(`  Sample: ${match[0]}`);
  }
});

console.log('\n✅ Verification complete!');
