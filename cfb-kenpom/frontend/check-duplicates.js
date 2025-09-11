// Script to check for duplicate teams in dummyData.ts
const fs = require('fs');
const path = require('path');

// Read the file content
const filePath = path.join(__dirname, 'src/data/dummyData.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Extract team names using regex
const teamNameRegex = /name:\s*"([^"]+)"/g;
const teams = [];
let match;

while ((match = teamNameRegex.exec(fileContent)) !== null) {
  teams.push(match[1]);
}

// Check for duplicates
const uniqueTeams = new Set(teams);
const duplicates = teams.filter((team, index) => teams.indexOf(team) !== index);

console.log('Total teams:', teams.length);
console.log('Unique teams:', uniqueTeams.size);
console.log('Duplicates:', duplicates);

// Print all teams by conference
const conferenceRegex = /name:\s*"([^"]+)",\s*conference:\s*"([^"]+)"/g;
const teamsByConference = {};

while ((match = conferenceRegex.exec(fileContent)) !== null) {
  const teamName = match[1];
  const conference = match[2];
  
  if (!teamsByConference[conference]) {
    teamsByConference[conference] = [];
  }
  
  teamsByConference[conference].push(teamName);
}

console.log('\nTeams by Conference:');
for (const conference in teamsByConference) {
  console.log(`\n${conference} (${teamsByConference[conference].length} teams):`);
  teamsByConference[conference].forEach(team => console.log(`- ${team}`));
}
