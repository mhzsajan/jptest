const fs = require('fs');
const path = require('path');

const testData = [
  { folder: 'jft-basic-1', num: 1 },
  { folder: 'jft-basic-2', num: 2 },
  { folder: 'jft-basic-3', num: 3 },
  { folder: 'jft-basic-4', num: 4 }
];

testData.forEach(test => {
  const filePath = path.join(__dirname, `tests/${test.folder}/${test.folder}-data.js`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const oldPath = `../../data/images/questions/${test.folder}/`;
  const newPath = `../../images/questions/jft basic test ${test.num}/`;
  
  // Simple string replace all occurrences
  while (content.includes(oldPath)) {
    content = content.replace(oldPath, newPath);
  }
  
  // Replace .jpg with .png
  content = content.replace(/\.jpg'/g, `.png'`);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Fixed ${test.folder}`);
});

console.log('✓ All image paths updated!');
