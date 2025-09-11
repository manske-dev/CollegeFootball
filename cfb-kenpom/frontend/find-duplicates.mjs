// Script to find exact positions of duplicate teams in dummyData.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the file content
const filePath = path.join(__dirname, 'src/data/dummyData.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Extract team names and their line numbers
const teamRegex = /^\s*name:\s*"([^"]+)"/gm;
const teams = [];
let match;
let lastIndex = 0;

while ((match = teamRegex.exec(fileContent)) !== null) {
  // Count line number
  const upToMatch = fileContent.substring(0, match.index);
  const lineNumber = upToMatch.split('\n').length;
  
  teams.push({
    name: match[1],
    line: lineNumber,
    index: match.index
  });
}

// Find duplicates
const teamNames = teams.map(t => t.name);
const duplicateNames = teamNames.filter((name, index) => teamNames.indexOf(name) !== index);
const uniqueDuplicateNames = [...new Set(duplicateNames)];

console.log('Duplicate teams:');
uniqueDuplicateNames.forEach(name => {
  const instances = teams.filter(t => t.name === name);
  console.log(`\n"${name}" appears ${instances.length} times:`);
  instances.forEach(instance => {
    console.log(`  Line ${instance.line}`);
  });
});
