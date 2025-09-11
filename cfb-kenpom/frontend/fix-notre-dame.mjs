// Script to fix the remaining Notre Dame duplicate entry
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the file content
const filePath = path.join(__dirname, 'src/data/dummyData.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Find the second occurrence of Notre Dame (around line 3332)
const notreFirstOccurrence = fileContent.indexOf('name: "Notre Dame"');
const notreSecondOccurrence = fileContent.indexOf('name: "Notre Dame"', notreFirstOccurrence + 1);

// Find the start and end of the second Notre Dame object
let startIndex = fileContent.lastIndexOf('{', notreSecondOccurrence);
let endIndex = -1;
let braceCount = 1;
for (let i = startIndex + 1; i < fileContent.length; i++) {
  if (fileContent[i] === '{') braceCount++;
  if (fileContent[i] === '}') braceCount--;
  if (braceCount === 0) {
    endIndex = i + 1;
    break;
  }
}

// Remove the second occurrence of Notre Dame
let newContent = fileContent;
if (startIndex !== -1 && endIndex !== -1) {
  // Check if there's a comma before the object
  const commaIndex = newContent.lastIndexOf(',', startIndex);
  if (commaIndex !== -1 && newContent.substring(commaIndex + 1, startIndex).trim() === '') {
    startIndex = commaIndex;
  }
  newContent = newContent.substring(0, startIndex) + newContent.substring(endIndex);
}

// Write the updated content back to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Duplicate Notre Dame entry has been removed from the file.');
