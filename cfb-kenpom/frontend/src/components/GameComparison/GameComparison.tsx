import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Grid,
  Tabs,
  Tab,
  Button,
  Stack,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Divider
} from '@mui/material';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Analytics,
  Timeline,
  Compare,
  TuneRounded,
  PlayArrow,
  Refresh
} from '@mui/icons-material';
import { dummyTeamData, gamesPredictions } from '../../data/dummyData';

// Define key stats to compare
const keyStatsToCompare = [
  { id: 'powerRating', label: 'Power Rating', higher: 'better' },
  { id: 'appd', label: 'Adjusted PPD', higher: 'better' },
  { id: 'defensiveSuccessRate', label: 'Def Success Rate', higher: 'better', format: 'percent' },
  { id: 'explosivePlayDiff', label: 'Explosive Play Diff', higher: 'better' },
  { id: 'thirdDownDiff', label: 'Third Down Diff', higher: 'better', format: 'percent' },
  { id: 'turnoverMargin', label: 'Turnover Margin', higher: 'better' },
  { id: 'lineYardsPerCarry', label: 'Line Yards/Carry', higher: 'better', format: 'decimal' },
  { id: 'havocRate', label: 'Havoc Rate', higher: 'better', format: 'percent' },
  { id: 'fieldPositionDiff', label: 'Field Position Diff', higher: 'better' },
  { id: 'qbEpa', label: 'QB EPA', higher: 'better', format: 'decimal' },
  { id: 'redZoneTdPctDiff', label: 'Red Zone TD% Diff', higher: 'better', format: 'percent' }
];

// Define matchup categories for analysis
const matchupCategories = [
  { id: 'offense', label: 'Offensive Advantage' },
  { id: 'defense', label: 'Defensive Advantage' },
  { id: 'specialTeams', label: 'Special Teams' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'momentum', label: 'Momentum' }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`comparison-tabpanel-${index}`}
      aria-labelledby={`comparison-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const GameComparison: React.FC = () => {
  const theme = useTheme(); // Used for theme-aware styling
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<any>(null);
  const [homeTeam, setHomeTeam] = useState<any>(null);
  const [awayTeam, setAwayTeam] = useState<any>(null);
  const [matchupAnalysis, setMatchupAnalysis] = useState<any>({});
  const [activeTab, setActiveTab] = useState(0);
  const [scenarioWeights, setScenarioWeights] = useState({
    offense: 25,
    defense: 25,
    specialTeams: 15,
    coaching: 15,
    momentum: 10,
    homeField: 10
  });
  const [weatherCondition, setWeatherCondition] = useState('clear');
  const [isRivalryGame, setIsRivalryGame] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  
  useEffect(() => {
    if (gameId) {
      const gameData = gamesPredictions.find(g => g.id === parseInt(gameId));
      if (gameData) {
        setGame(gameData);
        
        const homeTeamData = dummyTeamData.find(t => t.name === gameData.homeTeam);
        const awayTeamData = dummyTeamData.find(t => t.name === gameData.awayTeam);
        
        if (homeTeamData && awayTeamData) {
          setHomeTeam(homeTeamData);
          setAwayTeam(awayTeamData);
          
          // Generate matchup analysis
          generateMatchupAnalysis(homeTeamData, awayTeamData);
        }
      }
    }
  }, [gameId]);
  
  // Generate matchup analysis based on team stats
  const generateMatchupAnalysis = (home: any, away: any) => {
    const analysis: any = {};
    
    // Offensive advantage
    if (home.ypp > away.ypp) {
      analysis.offense = {
        advantage: 'home',
        reason: `${home.name} has a higher yards per play (${home.ypp.toFixed(1)} vs ${away.ypp.toFixed(1)})`,
        difference: ((home.ypp - away.ypp) / away.ypp * 100).toFixed(1) + '%'
      };
    } else {
      analysis.offense = {
        advantage: 'away',
        reason: `${away.name} has a higher yards per play (${away.ypp.toFixed(1)} vs ${home.ypp.toFixed(1)})`,
        difference: ((away.ypp - home.ypp) / home.ypp * 100).toFixed(1) + '%'
      };
    }
    
    // Defensive advantage
    if (home.defensiveSuccessRate > away.defensiveSuccessRate) {
      analysis.defense = {
        advantage: 'home',
        reason: `${home.name} has a better defensive success rate (${(home.defensiveSuccessRate * 100).toFixed(1)}% vs ${(away.defensiveSuccessRate * 100).toFixed(1)}%)`,
        difference: ((home.defensiveSuccessRate - away.defensiveSuccessRate) / away.defensiveSuccessRate * 100).toFixed(1) + '%'
      };
    } else {
      analysis.defense = {
        advantage: 'away',
        reason: `${away.name} has a better defensive success rate (${(away.defensiveSuccessRate * 100).toFixed(1)}% vs ${(home.defensiveSuccessRate * 100).toFixed(1)}%)`,
        difference: ((away.defensiveSuccessRate - home.defensiveSuccessRate) / home.defensiveSuccessRate * 100).toFixed(1) + '%'
      };
    }
    
    // Special teams (using field position differential as proxy)
    if (home.fieldPositionDiff > away.fieldPositionDiff) {
      analysis.specialTeams = {
        advantage: 'home',
        reason: `${home.name} has better field position differential (${home.fieldPositionDiff.toFixed(1)} vs ${away.fieldPositionDiff.toFixed(1)})`,
        difference: (home.fieldPositionDiff - away.fieldPositionDiff).toFixed(1) + ' yards'
      };
    } else {
      analysis.specialTeams = {
        advantage: 'away',
        reason: `${away.name} has better field position differential (${away.fieldPositionDiff.toFixed(1)} vs ${home.fieldPositionDiff.toFixed(1)})`,
        difference: (away.fieldPositionDiff - home.fieldPositionDiff).toFixed(1) + ' yards'
      };
    }
    
    // Coaching (using 3rd down differential as proxy)
    if (home.thirdDownDiff > away.thirdDownDiff) {
      analysis.coaching = {
        advantage: 'home',
        reason: `${home.name} has better third down differential (${(home.thirdDownDiff * 100).toFixed(1)}% vs ${(away.thirdDownDiff * 100).toFixed(1)}%)`,
        difference: ((home.thirdDownDiff - away.thirdDownDiff) * 100).toFixed(1) + '%'
      };
    } else {
      analysis.coaching = {
        advantage: 'away',
        reason: `${away.name} has better third down differential (${(away.thirdDownDiff * 100).toFixed(1)}% vs ${(home.thirdDownDiff * 100).toFixed(1)}%)`,
        difference: ((away.thirdDownDiff - home.thirdDownDiff) * 100).toFixed(1) + '%'
      };
    }
    
    // Momentum (using market sentiment as proxy)
    if (home.marketSentiment > away.marketSentiment) {
      analysis.momentum = {
        advantage: 'home',
        reason: `${home.name} has better market sentiment (${(home.marketSentiment * 100).toFixed(1)}% vs ${(away.marketSentiment * 100).toFixed(1)}%)`,
        difference: ((home.marketSentiment - away.marketSentiment) * 100).toFixed(1) + '%'
      };
    } else {
      analysis.momentum = {
        advantage: 'away',
        reason: `${away.name} has better market sentiment (${(away.marketSentiment * 100).toFixed(1)}% vs ${(home.marketSentiment * 100).toFixed(1)}%)`,
        difference: ((away.marketSentiment - home.marketSentiment) * 100).toFixed(1) + '%'
      };
    }
    
    setMatchupAnalysis(analysis);
  };
  
  // Format stat values based on type
  const formatStatValue = (value: number, format?: string) => {
    if (format === 'percent') {
      return (value * 100).toFixed(1) + '%';
    } else if (format === 'decimal') {
      return value.toFixed(2);
    } else {
      return value.toFixed(1);
    }
  };
  
  // Determine which team has advantage for a specific stat
  const getAdvantageTeam = (homeStat: number, awayStat: number, higher: string) => {
    if (higher === 'better') {
      return homeStat > awayStat ? 'home' : 'away';
    } else {
      return homeStat < awayStat ? 'home' : 'away';
    }
  };
  
  // Calculate advantage percentage
  const calculateAdvantagePercent = (homeStat: number, awayStat: number) => {
    if (homeStat > awayStat) {
      return ((homeStat - awayStat) / awayStat * 100).toFixed(1) + '%';
    } else {
      return ((awayStat - homeStat) / homeStat * 100).toFixed(1) + '%';
    }
  };
  
  // Create radar chart data
  const createRadarData = () => {
    if (!homeTeam || !awayTeam) return [];
    
    return [
      { category: 'Power Rating', [homeTeam.name]: homeTeam.powerRating / 30 * 100, [awayTeam.name]: awayTeam.powerRating / 30 * 100 },
      { category: 'Offense', [homeTeam.name]: homeTeam.ypp / 8 * 100, [awayTeam.name]: awayTeam.ypp / 8 * 100 },
      { category: 'Defense', [homeTeam.name]: homeTeam.defensiveSuccessRate * 100, [awayTeam.name]: awayTeam.defensiveSuccessRate * 100 },
      { category: 'Explosiveness', [homeTeam.name]: homeTeam.explosivePlayDiff / 6 * 100, [awayTeam.name]: awayTeam.explosivePlayDiff / 6 * 100 },
      { category: 'Efficiency', [homeTeam.name]: homeTeam.thirdDownDiff * 100 + 50, [awayTeam.name]: awayTeam.thirdDownDiff * 100 + 50 }
    ];
  };
  
  if (!game || !homeTeam || !awayTeam) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h5">Loading game data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ mr: 1 }}
          aria-label="Back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">Game Matchup Analysis</Typography>
      </Box>
      
      {/* Game Header Card */}
      <Paper 
        elevation={3} 
        sx={{ 
          padding: { xs: 2, md: 3 },
          mb: 3,
          background: `linear-gradient(90deg, ${alpha(homeTeam.primaryColor || '#1976d2', 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 50%, ${alpha(awayTeam.primaryColor || '#d32f2f', 0.8)} 100%)`,
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: homeTeam.primaryColor || '#1976d2' }}>
            {homeTeam.name}
          </Typography>
          <Typography variant="h6" sx={{ mx: 2 }}>vs</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: awayTeam.primaryColor || '#d32f2f' }}>
            {awayTeam.name}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">
            Projected Spread: {game.predictedSpread > 0 ? `${homeTeam.name} -${game.predictedSpread}` : `${awayTeam.name} -${Math.abs(game.predictedSpread)}`}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Win Probability: {homeTeam.name} {(game.winProbability * 100).toFixed(1)}% • {awayTeam.name} {((1 - game.winProbability) * 100).toFixed(1)}%
          </Typography>
        </Box>
      </Paper>
      
      {/* Team Comparison Radar Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Team Comparison</Typography>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={createRadarData()}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar 
                name={homeTeam.name} 
                dataKey={homeTeam.name} 
                stroke={homeTeam.primaryColor || '#1976d2'} 
                fill={homeTeam.primaryColor || '#1976d2'} 
                fillOpacity={0.3} 
              />
              <Radar 
                name={awayTeam.name} 
                dataKey={awayTeam.name} 
                stroke={awayTeam.primaryColor || '#d32f2f'} 
                fill={awayTeam.primaryColor || '#d32f2f'} 
                fillOpacity={0.3} 
              />
              <Legend />
              <RechartsTooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Key Stats Comparison */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Key Stats Comparison</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Stat</TableCell>
                  <TableCell align="right">{homeTeam.name}</TableCell>
                  <TableCell align="center">Advantage</TableCell>
                  <TableCell align="left">{awayTeam.name}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keyStatsToCompare.map(stat => {
                  const homeStat = homeTeam[stat.id];
                  const awayStat = awayTeam[stat.id];
                  const advantage = getAdvantageTeam(homeStat, awayStat, stat.higher);
                  const advantagePercent = calculateAdvantagePercent(homeStat, awayStat);
                  
                  return (
                    <TableRow key={stat.id}>
                      <TableCell component="th" scope="row">
                        {stat.label}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          fontWeight: advantage === 'home' ? 'bold' : 'normal',
                          color: advantage === 'home' ? homeTeam.primaryColor || '#1976d2' : 'inherit'
                        }}
                      >
                        {formatStatValue(homeStat, stat.format)}
                      </TableCell>
                      <TableCell align="center">
                        {advantage === 'home' ? (
                          <Tooltip title={`${homeTeam.name} has a ${advantagePercent} advantage`}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <TrendingUpIcon sx={{ color: homeTeam.primaryColor || '#1976d2', mr: 0.5 }} fontSize="small" />
                              <Typography variant="body2" sx={{ color: homeTeam.primaryColor || '#1976d2' }}>
                                {advantagePercent}
                              </Typography>
                            </Box>
                          </Tooltip>
                        ) : (
                          <Tooltip title={`${awayTeam.name} has a ${advantagePercent} advantage`}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <TrendingUpIcon sx={{ color: awayTeam.primaryColor || '#d32f2f', mr: 0.5 }} fontSize="small" />
                              <Typography variant="body2" sx={{ color: awayTeam.primaryColor || '#d32f2f' }}>
                                {advantagePercent}
                              </Typography>
                            </Box>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell 
                        align="left"
                        sx={{ 
                          fontWeight: advantage === 'away' ? 'bold' : 'normal',
                          color: advantage === 'away' ? awayTeam.primaryColor || '#d32f2f' : 'inherit'
                        }}
                      >
                        {formatStatValue(awayStat, stat.format)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Matchup Analysis */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Matchup Analysis</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {matchupCategories.map(category => {
              const analysis = matchupAnalysis[category.id];
              if (!analysis) return null;
              
              const advantageTeam = analysis.advantage === 'home' ? homeTeam : awayTeam;
              
              return (
                <Box key={category.id}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      borderLeft: `4px solid ${advantageTeam.primaryColor || '#1976d2'}`,
                      height: '100%'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {category.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip 
                        label={`${advantageTeam.name} +`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: advantageTeam.primaryColor || '#1976d2',
                          color: theme.palette.getContrastText(advantageTeam.primaryColor || '#1976d2')
                        }} 
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {analysis.difference} advantage
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {analysis.reason}
                    </Typography>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GameComparison;
