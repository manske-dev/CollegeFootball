// 2025 College Football Season Schedules for All Teams

export interface GameSchedule {
  week: number;
  date: string;
  opponent: string;
  location: 'home' | 'away' | 'neutral';
  conference: boolean;
  venue?: string;
  rivalry?: string;
  projectedSpread?: number;
}

export interface TeamSchedule {
  [teamName: string]: GameSchedule[];
}

export const team2025Schedules: TeamSchedule = {
  "Alabama": [
    { week: 1, date: "2025-08-30", opponent: "Western Carolina", location: "home", conference: false },
    { week: 2, date: "2025-09-06", opponent: "South Florida", location: "home", conference: false },
    { week: 3, date: "2025-09-13", opponent: "Wisconsin", location: "neutral", conference: false, venue: "Arlington, TX" },
    { week: 4, date: "2025-09-20", opponent: "Georgia", location: "away", conference: true },
    { week: 5, date: "2025-09-27", opponent: "Vanderbilt", location: "home", conference: true },
    { week: 6, date: "2025-10-04", opponent: "Arkansas", location: "away", conference: true },
    { week: 7, date: "2025-10-11", opponent: "South Carolina", location: "home", conference: true },
    { week: 8, date: "2025-10-18", opponent: "Tennessee", location: "away", conference: true },
    { week: 9, date: "2025-10-25", opponent: "Missouri", location: "home", conference: true },
    { week: 10, date: "2025-11-01", opponent: "LSU", location: "away", conference: true },
    { week: 11, date: "2025-11-08", opponent: "Mercer", location: "home", conference: false },
    { week: 12, date: "2025-11-15", opponent: "Oklahoma", location: "home", conference: true },
    { week: 13, date: "2025-11-29", opponent: "Auburn", location: "away", conference: true, rivalry: "Iron Bowl" }
  ],
  "Georgia": [
    { week: 1, date: "2025-08-30", opponent: "UT Martin", location: "home", conference: false },
    { week: 2, date: "2025-09-06", opponent: "Ball State", location: "home", conference: false },
    { week: 3, date: "2025-09-13", opponent: "South Carolina", location: "away", conference: true },
    { week: 4, date: "2025-09-20", opponent: "Alabama", location: "home", conference: true },
    { week: 5, date: "2025-09-27", opponent: "Auburn", location: "away", conference: true },
    { week: 6, date: "2025-10-04", opponent: "Mississippi State", location: "home", conference: true },
    { week: 7, date: "2025-10-11", opponent: "Texas", location: "away", conference: true },
    { week: 8, date: "2025-10-18", opponent: "Vanderbilt", location: "home", conference: true },
    { week: 9, date: "2025-10-25", opponent: "Florida", location: "neutral", conference: true, venue: "Jacksonville, FL", rivalry: "World's Largest Outdoor Cocktail Party" },
    { week: 10, date: "2025-11-01", opponent: "Ole Miss", location: "away", conference: true },
    { week: 11, date: "2025-11-08", opponent: "Tennessee", location: "home", conference: true },
    { week: 12, date: "2025-11-15", opponent: "UMass", location: "home", conference: false },
    { week: 13, date: "2025-11-29", opponent: "Georgia Tech", location: "home", conference: false, rivalry: "Clean, Old-Fashioned Hate" }
  ],
  "Ohio State": [
    { week: 1, date: "2025-08-30", opponent: "Akron", location: "home", conference: false },
    { week: 2, date: "2025-09-06", opponent: "Western Michigan", location: "home", conference: false },
    { week: 3, date: "2025-09-13", opponent: "Oregon", location: "home", conference: true },
    { week: 4, date: "2025-09-20", opponent: "Marshall", location: "home", conference: false },
    { week: 5, date: "2025-09-27", opponent: "Michigan State", location: "away", conference: true },
    { week: 6, date: "2025-10-04", opponent: "Iowa", location: "home", conference: true },
    { week: 7, date: "2025-10-11", opponent: "Nebraska", location: "away", conference: true },
    { week: 8, date: "2025-10-18", opponent: "Penn State", location: "home", conference: true },
    { week: 9, date: "2025-10-25", opponent: "Northwestern", location: "away", conference: true },
    { week: 10, date: "2025-11-01", opponent: "Purdue", location: "home", conference: true },
    { week: 11, date: "2025-11-08", opponent: "Indiana", location: "away", conference: true },
    { week: 12, date: "2025-11-15", opponent: "Illinois", location: "home", conference: true },
    { week: 13, date: "2025-11-29", opponent: "Michigan", location: "away", conference: true, rivalry: "The Game" }
  ],
  "Michigan": [
    { week: 1, date: "2025-08-30", opponent: "Fresno State", location: "home", conference: false },
    { week: 2, date: "2025-09-06", opponent: "Texas State", location: "home", conference: false },
    { week: 3, date: "2025-09-13", opponent: "UConn", location: "home", conference: false },
    { week: 4, date: "2025-09-20", opponent: "USC", location: "away", conference: true },
    { week: 5, date: "2025-09-27", opponent: "Minnesota", location: "home", conference: true },
    { week: 6, date: "2025-10-04", opponent: "Washington", location: "away", conference: true },
    { week: 7, date: "2025-10-11", opponent: "Illinois", location: "home", conference: true },
    { week: 8, date: "2025-10-18", opponent: "Michigan State", location: "away", conference: true, rivalry: "Paul Bunyan Trophy" },
    { week: 9, date: "2025-10-25", opponent: "Oregon", location: "away", conference: true },
    { week: 10, date: "2025-11-01", opponent: "Indiana", location: "home", conference: true },
    { week: 11, date: "2025-11-08", opponent: "Northwestern", location: "away", conference: true },
    { week: 12, date: "2025-11-15", opponent: "Maryland", location: "home", conference: true },
    { week: 13, date: "2025-11-29", opponent: "Ohio State", location: "home", conference: true, rivalry: "The Game" }
  ],
  "Texas": [
    { week: 1, date: "2025-08-30", opponent: "Colorado State", location: "home", conference: false },
    { week: 2, date: "2025-09-06", opponent: "Ohio", location: "home", conference: false },
    { week: 3, date: "2025-09-13", opponent: "UTSA", location: "home", conference: false },
    { week: 4, date: "2025-09-20", opponent: "Mississippi State", location: "away", conference: true },
    { week: 5, date: "2025-09-27", opponent: "Louisiana-Monroe", location: "home", conference: false },
    { week: 6, date: "2025-10-04", opponent: "Oklahoma", location: "neutral", conference: true, venue: "Dallas, TX", rivalry: "Red River Showdown" },
    { week: 7, date: "2025-10-11", opponent: "Georgia", location: "home", conference: true },
    { week: 8, date: "2025-10-18", opponent: "Vanderbilt", location: "away", conference: true },
    { week: 9, date: "2025-10-25", opponent: "Florida", location: "home", conference: true },
    { week: 10, date: "2025-11-01", opponent: "Arkansas", location: "away", conference: true },
    { week: 11, date: "2025-11-08", opponent: "Kentucky", location: "home", conference: true },
    { week: 12, date: "2025-11-15", opponent: "New Mexico State", location: "home", conference: false },
    { week: 13, date: "2025-11-29", opponent: "Texas A&M", location: "away", conference: true, rivalry: "Lone Star Showdown" }
  ],
  "Oregon": [
    { week: 1, date: "2025-08-30", opponent: "Idaho State", location: "home", conference: false },
    { week: 2, date: "2025-09-06", opponent: "Boise State", location: "away", conference: false },
    { week: 3, date: "2025-09-13", opponent: "Ohio State", location: "away", conference: true },
    { week: 4, date: "2025-09-20", opponent: "UCLA", location: "home", conference: true },
    { week: 5, date: "2025-09-27", opponent: "Stanford", location: "away", conference: false },
    { week: 6, date: "2025-10-04", opponent: "Michigan State", location: "home", conference: true },
    { week: 7, date: "2025-10-11", opponent: "Purdue", location: "away", conference: true },
    { week: 8, date: "2025-10-18", opponent: "Illinois", location: "home", conference: true },
    { week: 9, date: "2025-10-25", opponent: "Michigan", location: "home", conference: true },
    { week: 10, date: "2025-11-01", opponent: "Maryland", location: "away", conference: true },
    { week: 11, date: "2025-11-08", opponent: "Wisconsin", location: "home", conference: true },
    { week: 12, date: "2025-11-15", opponent: "Washington", location: "away", conference: true },
    { week: 13, date: "2025-11-29", opponent: "Oregon State", location: "home", conference: false, rivalry: "Civil War" }
  ],
  "Clemson": [
    { week: 1, date: "2025-08-30", opponent: "Furman", location: "home", conference: false },
    { week: 2, date: "2025-09-06", opponent: "Appalachian State", location: "home", conference: false },
    { week: 3, date: "2025-09-13", opponent: "NC State", location: "away", conference: true },
    { week: 4, date: "2025-09-20", opponent: "Stanford", location: "home", conference: false },
    { week: 5, date: "2025-09-27", opponent: "Florida State", location: "home", conference: true },
    { week: 6, date: "2025-10-04", opponent: "Wake Forest", location: "away", conference: true },
    { week: 7, date: "2025-10-11", opponent: "Virginia", location: "home", conference: true },
    { week: 8, date: "2025-10-18", opponent: "Louisville", location: "away", conference: true },
    { week: 9, date: "2025-10-25", opponent: "Virginia Tech", location: "home", conference: true },
    { week: 10, date: "2025-11-01", opponent: "Pittsburgh", location: "away", conference: true },
    { week: 11, date: "2025-11-08", opponent: "Citadel", location: "home", conference: false },
    { week: 12, date: "2025-11-15", opponent: "North Carolina", location: "home", conference: true },
    { week: 13, date: "2025-11-29", opponent: "South Carolina", location: "away", conference: false, rivalry: "Palmetto Bowl" }
  ],
  "Penn State": [
    { week: 1, date: "2025-08-30", opponent: "West Virginia", location: "neutral", conference: false, venue: "Pittsburgh, PA" },
    { week: 2, date: "2025-09-06", opponent: "Bowling Green", location: "home", conference: false },
    { week: 3, date: "2025-09-13", opponent: "Kent State", location: "home", conference: false },
    { week: 4, date: "2025-09-20", opponent: "Illinois", location: "away", conference: true },
    { week: 5, date: "2025-09-27", opponent: "UCLA", location: "home", conference: true },
    { week: 6, date: "2025-10-04", opponent: "Northwestern", location: "away", conference: true },
    { week: 7, date: "2025-10-11", opponent: "USC", location: "home", conference: true },
    { week: 8, date: "2025-10-18", opponent: "Ohio State", location: "away", conference: true },
    { week: 9, date: "2025-10-25", opponent: "Wisconsin", location: "home", conference: true },
    { week: 10, date: "2025-11-01", opponent: "Washington", location: "away", conference: true },
    { week: 11, date: "2025-11-08", opponent: "Rutgers", location: "home", conference: true },
    { week: 12, date: "2025-11-15", opponent: "Minnesota", location: "away", conference: true },
    { week: 13, date: "2025-11-29", opponent: "Maryland", location: "home", conference: true }
  ]
};

// Helper function to get a team's schedule
export const getTeamSchedule = (teamName: string): GameSchedule[] => {
  return team2025Schedules[teamName] || [];
};

// Helper function to get next game for a team
export const getNextGame = (teamName: string): GameSchedule | null => {
  const schedule = getTeamSchedule(teamName);
  const currentDate = new Date();
  
  for (const game of schedule) {
    if (new Date(game.date) > currentDate) {
      return game;
    }
  }
  
  return null;
};

// Helper function to get games by week
export const getGamesByWeek = (week: number): { [teamName: string]: GameSchedule } => {
  const weekGames: { [teamName: string]: GameSchedule } = {};
  
  Object.entries(team2025Schedules).forEach(([teamName, schedule]) => {
    const game = schedule.find(g => g.week === week);
    if (game) {
      weekGames[teamName] = game;
    }
  });
  
  return weekGames;
};
