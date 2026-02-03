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
  
  // Fix audio paths: jft-basic-X -> jft basic test X
  const oldAudioPath = `../../data/sound/questions/${t.folder}/`;
  const newAudioPath = `../../data/sound/questions/jft basic test ${t.num}/`;
  content = content.replace(new RegExp(oldAudioPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newAudioPath);
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Fixed audio paths in: ${t.folder}`);
});

console.log('All audio paths updated!');
