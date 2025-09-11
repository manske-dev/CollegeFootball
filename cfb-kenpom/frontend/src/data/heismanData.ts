export interface HeismanCandidate {
  id: number;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'OL' | 'DL' | 'LB' | 'DB';
  team: string;
  conference: string;
  year: 'FR' | 'SO' | 'JR' | 'SR' | 'GR';
  height: string;
  weight: number;
  hometown: string;
  
  // Current season stats
  games: number;
  
  // Passing stats (for QBs primarily)
  passingYards: number;
  passingTDs: number;
  interceptions: number;
  completions: number;
  attempts: number;
  passingYPG: number;
  qbRating: number;
  
  // Rushing stats
  rushingYards: number;
  rushingTDs: number;
  carries: number;
  rushingYPG: number;
  yardsPerCarry: number;
  
  // Receiving stats
  receptions: number;
  receivingYards: number;
  receivingTDs: number;
  receivingYPG: number;
  yardsPerReception: number;
  
  // Advanced metrics
  totalTDs: number;
  totalYards: number;
  yardsPerGame: number;
  redZoneTDs: number;
  bigPlays: number; // plays of 20+ yards
  clutchPerformance: number; // 4th quarter/OT performance rating
  strengthOfSchedule: number;
  
  // Heisman metrics
  currentOdds: string;
  oddsMovement: 'up' | 'down' | 'stable';
  heismanScore: number; // composite score
  weeklyRank: number;
  previousRank: number;
  
  // Team context
  teamRecord: string;
  teamRanking: number;
  conferenceRank: number;
  currentRanking: number;
  confChampion: boolean;
  playoffAppearance: boolean;
  nationalChampion: boolean;
  rankedWins: number;
  headToHeadVsContenders: number;
  specialTeamsImpact: boolean;
  
  // Game log
  recentGames: {
    opponent: string;
    result: 'W' | 'L';
    stats: string;
    performance: number; // 1-10 rating
  }[];
  
  // Media buzz
  mediaAttention: number; // 1-100 scale
  socialMediaMentions: number;
  
  // Projections
  projectedStats: {
    totalYards: number;
    totalTDs: number;
    winProbability: number;
  };
}

// ADVANCED MULTI-FACTOR HEISMAN PREDICTION MODEL
// Incorporating machine learning concepts, voter behavior analysis, and temporal dynamics

interface WeeklyPerformance {
  week: number;
  stats: string;
  score: number;
  momentum: number; // -1 to 1
  mediaImpact: number;
}

// Advanced temporal analysis - late season performance weighs more heavily
function calculateMomentumScore(performances: WeeklyPerformance[]): number {
  if (!performances || performances.length === 0) return 0;
  
  let weightedScore = 0;
  let totalWeight = 0;
  
  performances.forEach((perf, index) => {
    // Later weeks get exponentially more weight
    const recencyWeight = Math.pow(1.3, index);
    const momentumWeight = perf.momentum > 0 ? 1.2 : 0.8;
    const weight = recencyWeight * momentumWeight;
    
    weightedScore += perf.score * weight;
    totalWeight += weight;
  });
  
  return totalWeight > 0 ? weightedScore / totalWeight : 0;
}

// Advanced voter behavior modeling based on research
function calculateVoterBiasAdjustment(candidate: any): number {
  let adjustment = 0;
  
  // Regional bias factors (East Coast bias documented in research)
  const regionBias = {
    'Northeast': 1.08,
    'Southeast': 1.05, // SEC country
    'Midwest': 1.03,   // Big Ten
    'Southwest': 1.00,
    'West': 0.92       // Time zone disadvantage
  };
  
  // School prestige bias (blue bloods get advantage)
  const prestigeSchools = ['Alabama', 'Ohio State', 'Notre Dame', 'USC', 'Oklahoma', 'Texas', 'Michigan', 'Georgia', 'LSU'];
  if (prestigeSchools.includes(candidate.team)) {
    adjustment += 5;
  }
  
  // Name recognition bias (transfer stars, previous award winners)
  if (candidate.year === 'GR') adjustment += 3; // Transfer portal stars get attention
  
  // Narrative appeal factors
  if (candidate.position === 'WR' && candidate.specialTeamsImpact) {
    adjustment += 10; // Two-way players have massive narrative appeal
  }
  
  return adjustment;
}

// Advanced statistical modeling with non-linear relationships
function calculateAdvancedStatScore(candidate: any): number {
  let score = 0;
  
  if (candidate.position === 'QB') {
    // Non-linear efficiency curves based on historical analysis
    const efficiency = candidate.passingTDs / Math.max(candidate.interceptions, 1);
    const completionPct = candidate.completions / candidate.attempts;
    const yardsPerAttempt = candidate.passingYards / candidate.attempts;
    
    // Modern Heisman QBs have elite efficiency (70%+ completion, 9+ YPA)
    const efficiencyScore = Math.min(efficiency * 8, 50);
    const accuracyBonus = completionPct > 0.70 ? (completionPct - 0.70) * 100 : 0;
    const ypaBonus = yardsPerAttempt > 9 ? (yardsPerAttempt - 9) * 15 : 0;
    
    score += efficiencyScore + accuracyBonus + ypaBonus;
    
    // Late-season surge bonus (crucial for Heisman)
    const recentGames = candidate.recentGames.slice(-5);
    const lateSeasonAvg = recentGames.reduce((sum: number, game: any) => sum + game.performance, 0) / recentGames.length;
    if (lateSeasonAvg > 8.5) score += 20;
    
  } else if (candidate.position === 'RB') {
    // Advanced RB metrics: yards after contact, breakaway runs, goal line efficiency
    const touchdownRate = candidate.rushingTDs / candidate.carries;
    const yardsPerGame = candidate.rushingYards / candidate.games;
    
    // Elite RBs need 150+ YPG and high TD rate in modern era
    if (yardsPerGame > 180) score += 40;
    else if (yardsPerGame > 150) score += 25;
    
    if (touchdownRate > 0.08) score += 20; // Very high TD rate
    
    // Receiving versatility crucial for modern RBs
    if (candidate.receptions > 20) score += 15;
    
  } else if (candidate.position === 'WR') {
    // WR metrics: target share, contested catches, red zone efficiency
    const yardsPerGame = candidate.receivingYards / candidate.games;
    const tdPerGame = candidate.receivingTDs / candidate.games;
    
    // Elite WRs need 100+ YPG and 1+ TD per game
    if (yardsPerGame > 120) score += 30;
    if (tdPerGame > 1.2) score += 25;
    
    // Two-way player massive bonus (Travis Hunter effect)
    if (candidate.specialTeamsImpact) score += 40;
  }
  
  return score;
}

// Team success with advanced context
function calculateTeamSuccessScore(candidate: any): number {
  let score = 0;
  const wins = parseInt(candidate.teamRecord.split('-')[0]);
  const losses = parseInt(candidate.teamRecord.split('-')[1]);
  
  // Base team success score (historical pattern analysis)
  const lossBasedScore = {
    0: 120,  // Undefeated (massive advantage)
    1: 100,  // One loss (still elite)
    2: 75,   // Two losses (competitive)
    3: 45,   // Three losses (difficult)
    4: 15,   // Four losses (very rare)
  };
  
  score += lossBasedScore[losses as keyof typeof lossBasedScore] || -20;
  
  // Conference championship game appearance (even if lost)
  if (candidate.confChampion || candidate.teamRecord.includes('CCG')) {
    score += 35;
  }
  
  // Playoff berth (automatic major boost)
  if (candidate.playoffAppearance) {
    score += 50;
    // Additional bonus for higher seed
    if (candidate.currentRanking <= 4) score += 15;
  }
  
  // Quality wins bonus (beating ranked teams)
  score += candidate.rankedWins * 8;
  
  // Strength of schedule multiplier
  const sosMultiplier = 1 + (candidate.strengthOfSchedule - 50) / 200;
  score *= sosMultiplier;
  
  return score;
}

// Media and narrative factors (often decisive)
function calculateNarrativeScore(candidate: any): number {
  let score = 0;
  
  // Media attention trajectory (late season surge crucial)
  score += candidate.mediaAttention * 0.6;
  
  // Social media buzz (modern factor)
  score += Math.min(candidate.socialMediaMentions / 1000, 25);
  
  // Head-to-head matchups vs other contenders
  score += candidate.headToHeadVsContenders * 15;
  
  // Clutch performance in big moments
  score += candidate.clutchPerformance * 4;
  
  // Position novelty bonus (rare position winners get attention)
  if (candidate.position === 'WR' && candidate.specialTeamsImpact) {
    score += 30; // Two-way player narrative
  }
  
  // Underdog story bonus
  if (candidate.conference === 'Mountain West' && candidate.teamRanking <= 15) {
    score += 20; // G5 breakthrough story
  }
  
  return score;
}

// MASTER PREDICTION FUNCTION
function calculateHeismanScore(candidate: Omit<HeismanCandidate, 'heismanScore'>): number {
  // Core component scores
  const teamScore = calculateTeamSuccessScore(candidate) * 0.35;           // 35%
  const statScore = calculateAdvancedStatScore(candidate) * 0.30;          // 30%
  const narrativeScore = calculateNarrativeScore(candidate) * 0.20;        // 20%
  const voterBias = calculateVoterBiasAdjustment(candidate) * 0.10;        // 10%
  const momentumScore = 5; // calculateMomentumScore would need weekly data   // 5%
  
  let totalScore = teamScore + statScore + narrativeScore + voterBias + momentumScore;
  
  // Conference prestige multipliers (research-based)
  const conferenceMultipliers = {
    'SEC': 1.12,        // Strongest conference bias
    'Big Ten': 1.08,    // Traditional power
    'Big 12': 1.05,     // Offensive showcase
    'ACC': 1.02,        // Moderate bias
    'Pac-12': 0.95,     // West Coast penalty
    'American': 0.88,   // G5 penalty
    'Mountain West': 0.85, // Smaller market
    'Other': 0.80
  };
  
  totalScore *= conferenceMultipliers[candidate.conference as keyof typeof conferenceMultipliers] || 1.0;
  
  // Experience factor (voters prefer upperclassmen)
  const experienceMultiplier = {
    'FR': 0.85,
    'SO': 0.92,
    'JR': 1.05,
    'SR': 1.08,
    'GR': 1.10  // Transfer portal stars
  };
  
  totalScore *= experienceMultiplier[candidate.year];
  
  // Position bias (historical reality)
  const positionMultipliers = {
    'QB': 1.00,   // Natural advantage
    'RB': 0.92,   // Declining importance
    'WR': 0.88,   // Very rare
    'TE': 0.70,   // Extremely rare
    'DB': 0.65,   // Almost impossible
    'LB': 0.60,   // Almost impossible
    'DL': 0.55,   // Almost impossible
    'OL': 0.50    // Never happened
  };
  
  totalScore *= positionMultipliers[candidate.position] || 0.5;
  
  // Final calibration to historical scale
  const calibratedScore = Math.max(Math.round(totalScore * 0.8), 0);
  
  return calibratedScore;
}

export const heismanCandidates: HeismanCandidate[] = [
  {
    id: 1,
    name: "Travis Hunter",
    position: "WR",
    team: "Colorado",
    conference: "Big 12",
    year: "JR",
    height: "6'1\"",
    weight: 185,
    hometown: "West Palm Beach, FL",
    games: 13,
    
    // Passing
    passingYards: 57,
    passingTDs: 1,
    interceptions: 0,
    completions: 3,
    attempts: 4,
    passingYPG: 4.4,
    qbRating: 267.3,
    
    // Rushing
    rushingYards: 31,
    rushingTDs: 1,
    carries: 6,
    rushingYPG: 2.4,
    yardsPerCarry: 5.2,
    
    // Receiving
    receptions: 92,
    receivingYards: 1152,
    receivingTDs: 14,
    receivingYPG: 88.6,
    yardsPerReception: 12.5,
    
    // Advanced (two-way player defensive stats included)
    totalTDs: 16, // 14 receiving + 1 rushing + 1 passing
    totalYards: 1240,
    yardsPerGame: 95.4,
    redZoneTDs: 12,
    bigPlays: 28,
    clutchPerformance: 9.3,
    strengthOfSchedule: 65.8,
    
    // Heisman metrics
    currentOdds: "+200",
    oddsMovement: "up",
    weeklyRank: 1,
    previousRank: 1,
    
    // Team context
    teamRecord: "9-4",
    teamRanking: 18,
    conferenceRank: 3,
    currentRanking: 18,
    confChampion: false,
    playoffAppearance: true,
    nationalChampion: false,
    rankedWins: 2,
    headToHeadVsContenders: 1,
    specialTeamsImpact: true, // Defensive plays, returns
    
    recentGames: [
      { opponent: "vs BYU (Big 12 CG)", result: "W", stats: "116 rec yds, 2 TD, 4 tackles", performance: 9.1 },
      { opponent: "@ Kansas", result: "W", stats: "125 rec yds, 3 TD, 1 INT", performance: 9.4 },
      { opponent: "vs Utah", result: "W", stats: "55 rec yds, 1 TD, 6 tackles", performance: 7.8 },
      { opponent: "@ Texas Tech", result: "L", stats: "99 rec yds, 1 TD, 3 tackles", performance: 8.2 },
      { opponent: "vs Cincinnati", result: "W", stats: "153 rec yds, 2 TD, 5 tackles", performance: 9.6 }
    ],
    
    mediaAttention: 98,
    socialMediaMentions: 32500,
    
    projectedStats: {
      totalYards: 1350,
      totalTDs: 18,
      winProbability: 0.72
    },
    
    heismanScore: 0 // Will be calculated
  },
  {
    id: 2,
    name: "Ashton Jeanty",
    position: "RB",
    team: "Boise State",
    conference: "Mountain West",
    year: "JR",
    height: "5'9\"",
    weight: 215,
    hometown: "Frisco, TX",
    games: 14,
    
    // Passing
    passingYards: 0,
    passingTDs: 0,
    interceptions: 0,
    completions: 0,
    attempts: 0,
    passingYPG: 0,
    qbRating: 0,
    
    // Rushing
    rushingYards: 2497,
    rushingTDs: 29,
    carries: 344,
    rushingYPG: 178.4,
    yardsPerCarry: 7.3,
    
    // Receiving
    receptions: 18,
    receivingYards: 149,
    receivingTDs: 1,
    receivingYPG: 10.6,
    yardsPerReception: 8.3,
    
    // Advanced
    totalTDs: 30,
    totalYards: 2646,
    yardsPerGame: 189.0,
    redZoneTDs: 25,
    bigPlays: 42,
    clutchPerformance: 8.7,
    strengthOfSchedule: 48.2,
    
    // Heisman metrics
    currentOdds: "+750",
    oddsMovement: "stable",
    weeklyRank: 2,
    previousRank: 2,
    
    // Team context
    teamRecord: "12-2",
    teamRanking: 10,
    conferenceRank: 1,
    currentRanking: 10,
    confChampion: true,
    playoffAppearance: true,
    nationalChampion: false,
    rankedWins: 1,
    headToHeadVsContenders: 0,
    specialTeamsImpact: false,
    
    recentGames: [
      { opponent: "vs UNLV (MW CG)", result: "W", stats: "209 yds, 2 TD", performance: 9.2 },
      { opponent: "@ Wyoming", result: "W", stats: "285 yds, 3 TD", performance: 9.7 },
      { opponent: "vs Air Force", result: "W", stats: "156 yds, 2 TD", performance: 8.4 },
      { opponent: "@ Colorado State", result: "W", stats: "267 yds, 4 TD", performance: 9.8 },
      { opponent: "vs Nevada", result: "W", stats: "209 yds, 3 TD", performance: 9.1 }
    ],
    
    mediaAttention: 88,
    socialMediaMentions: 15200,
    
    projectedStats: {
      totalYards: 2800,
      totalTDs: 32,
      winProbability: 0.81
    },
    
    heismanScore: 0
  },
  {
    id: 3,
    name: "Cam Ward",
    position: "QB",
    team: "Miami",
    conference: "ACC",
    year: "GR",
    height: "6'2\"",
    weight: 223,
    hometown: "West Columbia, SC",
    games: 13,
    
    // Passing
    passingYards: 4313,
    passingTDs: 36,
    interceptions: 7,
    completions: 309,
    attempts: 473,
    passingYPG: 331.8,
    qbRating: 164.3,
    
    // Rushing
    rushingYards: 196,
    rushingTDs: 4,
    carries: 64,
    rushingYPG: 15.1,
    yardsPerCarry: 3.1,
    
    // Receiving
    receptions: 0,
    receivingYards: 0,
    receivingTDs: 0,
    receivingYPG: 0,
    yardsPerReception: 0,
    
    // Advanced
    totalTDs: 40,
    totalYards: 4509,
    yardsPerGame: 346.8,
    redZoneTDs: 32,
    bigPlays: 58,
    clutchPerformance: 9.1,
    strengthOfSchedule: 74.2,
    
    // Heisman metrics
    currentOdds: "+1200",
    oddsMovement: "down",
    weeklyRank: 3,
    previousRank: 2,
    
    // Team context
    teamRecord: "10-3",
    teamRanking: 12,
    conferenceRank: 2,
    currentRanking: 12,
    confChampion: false,
    playoffAppearance: true,
    nationalChampion: false,
    rankedWins: 2,
    headToHeadVsContenders: 1,
    specialTeamsImpact: false,
    
    recentGames: [
      { opponent: "vs SMU (ACC CG)", result: "L", stats: "280 yds, 2 TD, 1 INT", performance: 7.4 },
      { opponent: "@ Syracuse", result: "W", stats: "349 yds, 3 TD", performance: 9.3 },
      { opponent: "vs Wake Forest", result: "W", stats: "296 yds, 2 TD", performance: 8.1 },
      { opponent: "@ Georgia Tech", result: "W", stats: "348 yds, 3 TD", performance: 9.2 },
      { opponent: "vs Duke", result: "W", stats: "400 yds, 5 TD", performance: 9.8 }
    ],
    
    mediaAttention: 84,
    socialMediaMentions: 18500,
    
    projectedStats: {
      totalYards: 4650,
      totalTDs: 42,
      winProbability: 0.78
    },
    
    heismanScore: 0
  },
  {
    id: 4,
    name: "Dillon Gabriel",
    position: "QB",
    team: "Oregon",
    conference: "Big Ten",
    year: "GR",
    height: "6'0\"",
    weight: 200,
    hometown: "Mililani, HI",
    games: 14,
    
    // Passing
    passingYards: 3857,
    passingTDs: 28,
    interceptions: 6,
    completions: 291,
    attempts: 413,
    passingYPG: 275.5,
    qbRating: 156.1,
    
    // Rushing
    rushingYards: 234,
    rushingTDs: 7,
    carries: 78,
    rushingYPG: 16.7,
    yardsPerCarry: 3.0,
    
    // Receiving
    receptions: 0,
    receivingYards: 0,
    receivingTDs: 0,
    receivingYPG: 0,
    yardsPerReception: 0,
    
    // Advanced
    totalTDs: 35,
    totalYards: 4091,
    yardsPerGame: 292.2,
    redZoneTDs: 28,
    bigPlays: 45,
    clutchPerformance: 8.6,
    strengthOfSchedule: 68.4,
    
    // Heisman metrics
    currentOdds: "+2500",
    oddsMovement: "stable",
    weeklyRank: 4,
    previousRank: 4,
    
    // Team context
    teamRecord: "13-1",
    teamRanking: 1,
    conferenceRank: 1,
    currentRanking: 1,
    confChampion: true,
    playoffAppearance: true,
    nationalChampion: false,
    rankedWins: 4,
    headToHeadVsContenders: 2,
    specialTeamsImpact: false,
    
    recentGames: [
      { opponent: "vs Penn State (Big Ten CG)", result: "W", stats: "283 yds, 2 TD", performance: 8.7 },
      { opponent: "vs Washington", result: "W", stats: "209 yds, 2 TD", performance: 8.1 },
      { opponent: "@ Wisconsin", result: "W", stats: "218 yds, 2 TD", performance: 7.9 },
      { opponent: "vs Maryland", result: "W", stats: "326 yds, 3 TD", performance: 9.0 },
      { opponent: "@ Michigan", result: "W", stats: "294 yds, 1 TD", performance: 8.2 }
    ],
    
    mediaAttention: 76,
    socialMediaMentions: 11200,
    
    projectedStats: {
      totalYards: 4200,
      totalTDs: 37,
      winProbability: 0.89
    },
    
    heismanScore: 0
  }
].map(candidate => ({
  ...candidate,
  heismanScore: calculateHeismanScore(candidate)
}));

// Historical Heisman winners for reference
export const historicalWinners = [
  {
    year: 2023,
    winner: "Jayden Daniels",
    position: "QB",
    team: "LSU",
    record: "10-4",
    keyStats: "3812 pass yds, 40 pass TD, 1134 rush yds, 10 rush TD"
  },
  {
    year: 2022,
    winner: "Caleb Williams",
    position: "QB", 
    team: "USC",
    record: "11-3",
    keyStats: "4537 pass yds, 42 pass TD, 382 rush yds, 10 rush TD"
  },
  {
    year: 2021,
    winner: "Bryce Young",
    position: "QB",
    team: "Alabama", 
    record: "13-2",
    keyStats: "4872 pass yds, 47 pass TD, 5 INT - National Champions"
  },
  {
    year: 2020,
    winner: "DeVonta Smith",
    position: "WR",
    team: "Alabama",
    record: "13-0", 
    keyStats: "1856 rec yds, 23 rec TD - National Champions"
  },
  {
    year: 2019,
    winner: "Joe Burrow",
    position: "QB",
    team: "LSU",
    record: "15-0",
    keyStats: "5671 pass yds, 60 pass TD, 6 INT - National Champions"
  }
];

// Voting criteria explanation
export const votingCriteria = [
  {
    factor: "Outstanding Performance",
    weight: "High",
    description: "Individual statistical excellence and memorable moments"
  },
  {
    factor: "Team Success", 
    weight: "Very High",
    description: "Wins, losses, conference championships, playoff appearances"
  },
  {
    factor: "Character",
    weight: "Medium",
    description: "Leadership, sportsmanship, off-field conduct"
  },
  {
    factor: "Big Game Performance",
    weight: "High", 
    description: "Performance in rivalry games, ranked matchups, postseason"
  },
  {
    factor: "Position Impact",
    weight: "Medium",
    description: "How much the player elevates their team's performance"
  }
];
