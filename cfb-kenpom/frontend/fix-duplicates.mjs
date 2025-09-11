// Script to fix duplicate teams in dummyData.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the file content
const filePath = path.join(__dirname, 'src/data/dummyData.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

// List of duplicate team names to remove (second occurrences)
const duplicateTeams = [
  'Boston College', 'Duke', 'Georgia Tech', 'Louisville', 'Miami',
  'North Carolina', 'NC State', 'Pittsburgh', 'Syracuse', 'Virginia',
  'Virginia Tech', 'Wake Forest', 'SMU', 'California', 'Stanford'
];

// Special case for Notre Dame which appears in two different places
const notreFirstOccurrence = fileContent.indexOf('name: "Notre Dame"');
const notreSecondOccurrence = fileContent.indexOf('name: "Notre Dame"', notreFirstOccurrence + 1);

// Find the start and end of the second Notre Dame object
let notreStartIndex = fileContent.lastIndexOf('{', notreSecondOccurrence);
let notreEndIndex = -1;
let braceCount = 1;
for (let i = notreStartIndex + 1; i < fileContent.length; i++) {
  if (fileContent[i] === '{') braceCount++;
  if (fileContent[i] === '}') braceCount--;
  if (braceCount === 0) {
    notreEndIndex = i + 1;
    break;
  }
}

// Process each duplicate team (except Notre Dame which is handled separately)
let newContent = fileContent;
for (const team of duplicateTeams) {
  const firstOccurrence = newContent.indexOf(`name: "${team}"`);
  const secondOccurrence = newContent.indexOf(`name: "${team}"`, firstOccurrence + 1);
  
  if (secondOccurrence !== -1) {
    // Find the start and end of the second team object
    let startIndex = newContent.lastIndexOf('{', secondOccurrence);
    let endIndex = -1;
    let braceCount = 1;
    for (let i = startIndex + 1; i < newContent.length; i++) {
      if (newContent[i] === '{') braceCount++;
      if (newContent[i] === '}') braceCount--;
      if (braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
    
    // Remove the second occurrence of the team object and the comma before it
    if (startIndex !== -1 && endIndex !== -1) {
      // Check if there's a comma before the object
      const commaIndex = newContent.lastIndexOf(',', startIndex);
      if (commaIndex !== -1 && newContent.substring(commaIndex + 1, startIndex).trim() === '') {
        startIndex = commaIndex;
      }
      newContent = newContent.substring(0, startIndex) + newContent.substring(endIndex);
    }
  }
}

// Remove the second Notre Dame entry if found
if (notreStartIndex !== -1 && notreEndIndex !== -1) {
  // Check if there's a comma before the object
  const commaIndex = newContent.lastIndexOf(',', notreStartIndex);
  if (commaIndex !== -1 && newContent.substring(commaIndex + 1, notreStartIndex).trim() === '') {
    notreStartIndex = commaIndex;
  }
  newContent = newContent.substring(0, notreStartIndex) + newContent.substring(notreEndIndex);
}

// Write the updated content back to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Duplicate teams have been removed from the file.');
