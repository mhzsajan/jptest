const fs = require('fs');

const tests = [
  { folder: 'jft-basic-1', num: 1 },
  { folder: 'jft-basic-2', num: 2 },
  { folder: 'jft-basic-3', num: 3 },
  { folder: 'jft-basic-4', num: 4 }
];

tests.forEach(t => {
  const file = `tests/${t.folder}/${t.folder}-data.js`;
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace old image paths with correct ones
  content = content.replace(
    new RegExp(`../../data/images/questions/${t.folder}/`, 'g'),
    `../../images/questions/jft basic test ${t.num}/`
  );
  
  // Change .jpg to .png
  content = content.replace(/\.jpg'/g, `.png'`);
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Fixed image paths in: ${t.folder}`);
});

console.log('All files updated successfully!');
