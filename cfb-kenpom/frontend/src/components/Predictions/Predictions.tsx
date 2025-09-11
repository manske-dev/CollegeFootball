import React, { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Card,
  CardContent,
  Tooltip,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { gamesPredictions, dummyTeamData } from '../../data/dummyData';

// Add market odds data to our predictions for comparison
interface MarketOdds {
  spread: number;
  total: number;
}

// This would come from an API in a real app
const getMarketOdds = (homeTeam: string, awayTeam: string): MarketOdds => {
  // For demo purposes, generate market odds that are close to but slightly different from our predictions
  // In a real app, this would fetch from an odds API
  const game = gamesPredictions.find(g => g.homeTeam === homeTeam && g.awayTeam === awayTeam);
  
  if (!game) return { spread: 0, total: 0 };
  
  // Generate slight variations from our predictions to simulate market odds
  // Add some randomness to create "edges"
  const randomFactor = Math.random() * 2 - 1; // Between -1 and 1
  const spreadDiff = randomFactor * 2.5; // Up to 2.5 points difference
  const totalDiff = randomFactor * 3; // Up to 3 points difference
  
  return {
    spread: game.predictedSpread + spreadDiff,
    total: game.predictedTotal + totalDiff
  };
};

// Calculate edge percentage between our model and the market
const calculateEdge = (modelValue: number, marketValue: number): number => {
  return ((modelValue - marketValue) / Math.abs(marketValue)) * 100;
};

// Edge grading system
interface EdgeGrade {
  grade: string;
  rating: number;
  color: string;
  backgroundColor: string;
  description: string;
}

const getEdgeGrade = (edgePercentage: number): EdgeGrade => {
  const absEdge = Math.abs(edgePercentage);
  
  if (absEdge >= 8) {
    return {
      grade: 'A+',
      rating: 10,
      color: '#ffffff',
      backgroundColor: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
      description: '🔥 EXCEPTIONAL EDGE - Prime betting opportunity!'
    };
  } else if (absEdge >= 6) {
    return {
      grade: 'A',
      rating: 9,
      color: '#ffffff',
      backgroundColor: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
      description: '⭐ EXCELLENT EDGE - Very strong opportunity'
    };
  } else if (absEdge >= 4.5) {
    return {
      grade: 'B+',
      rating: 8,
      color: '#1b5e20',
      backgroundColor: '#e8f5e8',
      description: 'Strong edge - Good betting opportunity'
    };
  } else if (absEdge >= 3) {
    return {
      grade: 'B',
      rating: 7,
      color: '#2e7d32',
      backgroundColor: '#f1f8e9',
      description: 'Solid edge - Moderate betting opportunity'
    };
  } else if (absEdge >= 2) {
    return {
      grade: 'C+',
      rating: 6,
      color: '#689f38',
      backgroundColor: '#f9fbe7',
      description: 'Mild edge - Slight betting opportunity'
    };
  } else if (absEdge >= 1) {
    return {
      grade: 'C',
      rating: 5,
      color: '#9e9e9e',
      backgroundColor: '#f5f5f5',
      description: 'Minimal edge - Limited opportunity'
    };
  } else {
    return {
      grade: 'D',
      rating: 1,
      color: '#bdbdbd',
      backgroundColor: 'transparent',
      description: 'No significant edge'
    };
  }
};

// Calculate overall edge grade for a game (takes the better of spread or total edge)
const calculateGameEdgeGrade = (spreadEdge: number, totalEdge: number): EdgeGrade => {
  const maxEdge = Math.max(Math.abs(spreadEdge), Math.abs(totalEdge));
  return getEdgeGrade(maxEdge);
};

const Predictions: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  const [edgeThreshold, setEdgeThreshold] = useState<number>(3); // Edge threshold in percentage
  const [sortBy, setSortBy] = useState<'edge' | 'date' | 'spread' | 'total'>('edge');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const handleWeekChange = (event: SelectChangeEvent) => {
    setSelectedWeek(event.target.value);
  };
  
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as 'edge' | 'date' | 'spread' | 'total');
  };
  

  
  // In a real app, we'd filter by actual week data
  // For now, we'll just use the dummy data as is
  let filteredGames = [...gamesPredictions];
  
  // Add edge grades to games and sort
  const gamesWithEdges = filteredGames.map(game => {
    const marketOdds = getMarketOdds(game.homeTeam, game.awayTeam);
    const spreadEdge = calculateEdge(game.predictedSpread, marketOdds.spread);
    const totalEdge = calculateEdge(game.predictedTotal, marketOdds.total);
    const edgeGrade = calculateGameEdgeGrade(spreadEdge, totalEdge);
    
    return {
      ...game,
      marketOdds,
      spreadEdge,
      totalEdge,
      edgeGrade
    };
  });
  
  // Sort games based on selected criteria
  const sortedGames = gamesWithEdges.sort((a, b) => {
    let aValue: number, bValue: number;
    
    switch (sortBy) {
      case 'edge':
        aValue = a.edgeGrade.rating;
        bValue = b.edgeGrade.rating;
        break;
      case 'spread':
        aValue = Math.abs(a.spreadEdge);
        bValue = Math.abs(b.spreadEdge);
        break;
      case 'total':
        aValue = Math.abs(a.totalEdge);
        bValue = Math.abs(b.totalEdge);
        break;
      case 'date':
      default:
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
    }
    
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });
  
  // Function to handle game row click
  const handleGameClick = (gameId: number) => {
    navigate(`/game/${gameId}`);
  };
  
  // Function to check if a game has already taken place
  const isUpcomingGame = (gameDate: string) => {
    const today = new Date();
    const game = new Date(gameDate);
    return game > today;
  };
  
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Game Predictions
      </Typography>
      
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="body1" paragraph>
          Our model generates point spread and total predictions for upcoming college football games.
          Predictions are based on team power ratings, head-to-head matchups, and situational factors.
        </Typography>
        
        {/* Sorting Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl size="small" variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="edge">Edge Rating</MenuItem>
              <MenuItem value="spread">Spread Edge</MenuItem>
              <MenuItem value="total">Total Edge</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-order-label">Order</InputLabel>
            <Select
              labelId="sort-order-label"
              value={sortOrder}
              label="Order"
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <MenuItem value="desc">High to Low</MenuItem>
              <MenuItem value="asc">Low to High</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Stack direction="row" spacing={2} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '30%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Model Accuracy
                </Typography>
                <Typography variant="h4">
                  54.7%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Against the spread (2019-2024)
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '30%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Mean Absolute Error
                </Typography>
                <Typography variant="h4">
                  3.8
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Points vs. closing spread
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '30%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Predictions
                </Typography>
                <Typography variant="h4">
                  52.1%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accuracy on over/under
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Paper>
      
      {/* Premium Opportunities Section */}
      {(() => {
        const premiumGames = sortedGames.filter(game => {
          const { edgeGrade } = game;
          return edgeGrade.rating >= 9; // A+ and A grades only
        });
        
        if (premiumGames.length > 0) {
          return (
            <Paper 
              elevation={4} 
              sx={{ 
                mb: 3, 
                p: 3,
                background: 'linear-gradient(135deg, rgba(27, 94, 32, 0.08) 0%, rgba(46, 125, 50, 0.05) 100%)',
                border: '2px solid rgba(27, 94, 32, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #1b5e20 0%, #2e7d32 50%, #1b5e20 100%)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(27, 94, 32, 0.3)'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    🔥 PREMIUM OPPORTUNITIES
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {premiumGames.length} game{premiumGames.length !== 1 ? 's' : ''} with exceptional edge (A+/A grades)
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {premiumGames.slice(0, 3).map((game) => {
                  const { edgeGrade, spreadEdge, totalEdge } = game;
                  const maxEdge = Math.max(Math.abs(spreadEdge), Math.abs(totalEdge));
                  
                  return (
                    <Box 
                      key={game.id}
                      onClick={() => isUpcomingGame(game.date) ? handleGameClick(game.id) : null}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 2,
                        border: '1px solid rgba(27, 94, 32, 0.2)',
                        cursor: isUpcomingGame(game.date) ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(27, 94, 32, 0.2)',
                          background: 'rgba(255, 255, 255, 0.95)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Chip
                          label={edgeGrade.grade}
                          sx={{
                            background: edgeGrade.backgroundColor,
                            color: edgeGrade.color,
                            fontWeight: 900,
                            fontSize: '0.9rem',
                            minWidth: '50px',
                            height: '32px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 4px 12px rgba(27, 94, 32, 0.4)'
                          }}
                        />
                        <Box>
                          <Typography variant="body1" fontWeight={700}>
                            {game.awayTeam} @ {game.homeTeam}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {game.date} • {maxEdge.toFixed(1)}% edge
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight={600} color="success.main">
                          {edgeGrade.description}
                        </Typography>
                        {isUpcomingGame(game.date) && (
                          <Typography variant="caption" color="primary.main">
                            Click for analysis →
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
                
                {premiumGames.length > 3 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                    +{premiumGames.length - 3} more premium opportunities below
                  </Typography>
                )}
              </Box>
            </Paper>
          );
        }
        return null;
      })()}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h5">
          All Game Predictions
        </Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="week-select-label">Filter by Week</InputLabel>
          <Select
            labelId="week-select-label"
            id="week-select"
            value={selectedWeek}
            label="Filter by Week"
            onChange={handleWeekChange}
          >
            <MenuItem value="all">All Upcoming Games</MenuItem>
            <MenuItem value="1">Week 1</MenuItem>
            <MenuItem value="2">Week 2</MenuItem>
            <MenuItem value="3">Week 3</MenuItem>
            <MenuItem value="4">Week 4</MenuItem>
            <MenuItem value="5">Week 5</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : '#f5f5f5' }}>
              <TableCell>Edge Grade</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Away Team</TableCell>
              <TableCell>Home Team</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Typography>Predicted Spread</Typography>
                  <Tooltip title="Our model's predicted point spread. Positive means home team is favored by that many points.">
                    <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, opacity: 0.7 }} />
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Typography>Market Spread</Typography>
                  <Tooltip title="Current market consensus spread from sportsbooks">
                    <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, opacity: 0.7 }} />
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Typography>Predicted Total</Typography>
                  <Tooltip title="Our model's predicted total points scored in the game">
                    <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, opacity: 0.7 }} />
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Typography>Market Total</Typography>
                  <Tooltip title="Current market consensus over/under from sportsbooks">
                    <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, opacity: 0.7 }} />
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell align="right">Edge</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedGames.map((game) => {
              const homeTeam = dummyTeamData.find(team => team.name === game.homeTeam);
              const awayTeam = dummyTeamData.find(team => team.name === game.awayTeam);
              
              // Use pre-calculated values from sorting
              const { marketOdds, spreadEdge, totalEdge, edgeGrade } = game;
              
              // Determine if there's a significant edge
              const hasSpreadEdge = Math.abs(spreadEdge) >= edgeThreshold;
              const hasTotalEdge = Math.abs(totalEdge) >= edgeThreshold;
              
              // Determine which bet has the larger edge
              const primaryEdge = Math.abs(spreadEdge) > Math.abs(totalEdge) ? 
                { type: 'spread', value: spreadEdge } : 
                { type: 'total', value: totalEdge };
              
              // Get edge direction (over or under for totals, home or away for spreads)
              const getEdgeDirection = (type: string, value: number) => {
                if (type === 'spread') {
                  return value > 0 ? 
                    (game.predictedSpread > 0 ? 'Home team not favored enough' : 'Away team not favored enough') :
                    (game.predictedSpread > 0 ? 'Home team too favored' : 'Away team too favored');
                } else {
                  return value > 0 ? 'Over' : 'Under';
                }
              };
              
              return (
                <TableRow 
                  key={game.id}
                  onClick={() => isUpcomingGame(game.date) ? handleGameClick(game.id) : null}
                  sx={{
                    // Premium grades (A+/A) get strong visual treatment
                    backgroundColor: edgeGrade.rating >= 9 ? 
                      'linear-gradient(135deg, rgba(27, 94, 32, 0.15) 0%, rgba(46, 125, 50, 0.1) 100%)' :
                      edgeGrade.rating >= 8 ? 
                        alpha('#2e7d32', 0.08) :
                        edgeGrade.rating > 5 ? 
                          alpha('#689f38', 0.05) : 
                          'inherit',
                    cursor: isUpcomingGame(game.date) ? 'pointer' : 'default',
                    transition: 'all 0.3s ease',
                    // Premium grades get thicker, more prominent borders
                    borderLeft: edgeGrade.rating >= 9 ? 
                      `6px solid #1b5e20` :
                      edgeGrade.rating >= 8 ? 
                        `5px solid #2e7d32` :
                        edgeGrade.rating > 5 ? 
                          `3px solid #689f38` : 
                          'none',
                    // Premium grades get subtle glow effect
                    boxShadow: edgeGrade.rating >= 9 ? 
                      '0 2px 8px rgba(27, 94, 32, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)' :
                      edgeGrade.rating >= 8 ? 
                        '0 1px 4px rgba(46, 125, 50, 0.15)' : 
                        'none',
                    // Lower grades get more subtle treatment
                    opacity: edgeGrade.rating <= 5 ? 0.85 : 1,
                    '&:hover': {
                      backgroundColor: isUpcomingGame(game.date) ? 
                        (edgeGrade.rating >= 9 ? 
                          'linear-gradient(135deg, rgba(27, 94, 32, 0.25) 0%, rgba(46, 125, 50, 0.2) 100%)' :
                          alpha(theme.palette.primary.main, 0.08)) :
                        edgeGrade.rating >= 9 ? 
                          'linear-gradient(135deg, rgba(27, 94, 32, 0.25) 0%, rgba(46, 125, 50, 0.2) 100%)' :
                          edgeGrade.rating >= 8 ? 
                            alpha('#2e7d32', 0.15) :
                            edgeGrade.rating > 5 ? 
                              alpha('#689f38', 0.1) : 
                              alpha(theme.palette.action.hover, 0.05),
                      transform: isUpcomingGame(game.date) ? 
                        (edgeGrade.rating >= 9 ? 'translateY(-2px) scale(1.002)' : 'translateY(-1px)') : 
                        (edgeGrade.rating >= 9 ? 'scale(1.002)' : 'none'),
                      boxShadow: isUpcomingGame(game.date) ? 
                        (edgeGrade.rating >= 9 ? 
                          '0 8px 16px rgba(27, 94, 32, 0.3), 0 4px 8px rgba(27, 94, 32, 0.2)' :
                          `0 4px 8px ${alpha(theme.palette.primary.main, 0.15)}`) :
                        (edgeGrade.rating >= 9 ? 
                          '0 4px 12px rgba(27, 94, 32, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)' :
                          edgeGrade.rating >= 8 ? 
                            '0 2px 8px rgba(46, 125, 50, 0.2)' : 
                            'none'),
                      opacity: 1
                    },
                    position: 'relative',
                    // Add subtle animation for premium grades
                    ...(edgeGrade.rating >= 9 && {
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(27, 94, 32, 0.6) 50%, transparent 100%)',
                        animation: 'shimmer 3s ease-in-out infinite'
                      },
                      '@keyframes shimmer': {
                        '0%': { opacity: 0.3 },
                        '50%': { opacity: 0.8 },
                        '100%': { opacity: 0.3 }
                      }
                    })
                  }}
                >
                  <TableCell>
                    <Tooltip 
                      title={
                        <>
                          <Typography variant="body2" fontWeight="bold">
                            {edgeGrade.description}
                          </Typography>
                          <Typography variant="body2">
                            Rating: {edgeGrade.rating}/10
                          </Typography>
                          <Typography variant="body2">
                            Max Edge: {Math.max(Math.abs(spreadEdge), Math.abs(totalEdge)).toFixed(1)}%
                          </Typography>
                        </>
                      }
                      arrow
                    >
                      <Chip
                        label={edgeGrade.grade}
                        size={edgeGrade.rating >= 9 ? "medium" : "small"}
                        sx={{
                          background: edgeGrade.backgroundColor,
                          color: edgeGrade.color,
                          fontWeight: edgeGrade.rating >= 9 ? 900 : 'bold',
                          fontSize: edgeGrade.rating >= 9 ? '0.9rem' : '0.75rem',
                          minWidth: edgeGrade.rating >= 9 ? '50px' : '40px',
                          height: edgeGrade.rating >= 9 ? '32px' : '24px',
                          border: edgeGrade.rating >= 9 ? '2px solid rgba(255,255,255,0.3)' : 'none',
                          boxShadow: edgeGrade.rating >= 9 ? 
                            '0 4px 12px rgba(27, 94, 32, 0.4), 0 0 20px rgba(27, 94, 32, 0.2)' : 
                            edgeGrade.rating >= 8 ? '0 2px 8px rgba(56, 142, 60, 0.3)' : 'none',
                          animation: edgeGrade.rating >= 9 ? 
                            'pulse 2s ease-in-out infinite alternate' : 'none',
                          transform: edgeGrade.rating >= 9 ? 'scale(1.1)' : 'scale(1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: edgeGrade.rating >= 9 ? 'scale(1.15)' : 'scale(1.05)',
                            boxShadow: edgeGrade.rating >= 9 ? 
                              '0 6px 16px rgba(27, 94, 32, 0.5), 0 0 25px rgba(27, 94, 32, 0.3)' :
                              edgeGrade.rating >= 8 ? '0 4px 12px rgba(56, 142, 60, 0.4)' : 'none'
                          },
                          '@keyframes pulse': {
                            '0%': {
                              boxShadow: '0 4px 12px rgba(27, 94, 32, 0.4), 0 0 20px rgba(27, 94, 32, 0.2)'
                            },
                            '100%': {
                              boxShadow: '0 6px 16px rgba(27, 94, 32, 0.6), 0 0 30px rgba(27, 94, 32, 0.4)'
                            }
                          }
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>{game.date}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box 
                        sx={{ 
                          width: 15, 
                          height: 15, 
                          backgroundColor: awayTeam?.primaryColor || '#ccc',
                          borderRadius: '50%'
                        }} 
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {game.awayTeam}
                        </Typography>
                        {isUpcomingGame(game.date) && (
                          <Tooltip title="Click to view detailed matchup analysis">
                            <AnalyticsIcon 
                              fontSize="small" 
                              sx={{ 
                                color: theme.palette.primary.main,
                                opacity: 0.6,
                                ml: 0.5
                              }} 
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box 
                        sx={{ 
                          width: 15, 
                          height: 15, 
                          backgroundColor: homeTeam?.primaryColor || '#ccc',
                          borderRadius: '50%'
                        }} 
                      />
                      {game.homeTeam}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: hasSpreadEdge ? 700 : 400,
                    color: hasSpreadEdge ? theme.palette.success.main : 'inherit'
                  }}>
                    {game.predictedSpread > 0 ? '+' : ''}{game.predictedSpread.toFixed(1)}
                  </TableCell>
                  <TableCell align="right">
                    {marketOdds.spread > 0 ? '+' : ''}{marketOdds.spread.toFixed(1)}
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: hasTotalEdge ? 700 : 400,
                    color: hasTotalEdge ? theme.palette.success.main : 'inherit'
                  }}>
                    {game.predictedTotal.toFixed(1)}
                  </TableCell>
                  <TableCell align="right">
                    {marketOdds.total.toFixed(1)}
                  </TableCell>
                  <TableCell align="right">
                    {(Math.abs(spreadEdge) > edgeThreshold || Math.abs(totalEdge) > edgeThreshold) ? (
                      <Tooltip 
                        title={
                          <>
                            <Typography variant="body2" fontWeight="bold">
                              {primaryEdge.type === 'spread' ? 'Spread Edge' : 'Total Edge'}
                            </Typography>
                            <Typography variant="body2">
                              {getEdgeDirection(primaryEdge.type, primaryEdge.value)}
                            </Typography>
                            <Typography variant="body2">
                              {Math.abs(primaryEdge.value).toFixed(1)}% difference from market
                            </Typography>
                          </>
                        }
                        arrow
                      >
                        <Chip
                          icon={primaryEdge.value > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                          label={`${Math.abs(primaryEdge.value).toFixed(1)}%`}
                          size="small"
                          color="success"
                          sx={{ fontWeight: 700 }}
                        />
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No edge
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ marginTop: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper elevation={1} sx={{ p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Understanding the Interface
          </Typography>
          <Typography variant="body2" paragraph>
            Rows highlighted in green indicate games where our model predicts a significant difference from the market odds (≥{edgeThreshold}% edge).
            These represent potential value betting opportunities where our model sees the market as mispriced.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Clickable Games:</strong> Games that haven't taken place yet are clickable (indicated by the analytics icon). 
            Click on any upcoming game to view a detailed matchup analysis including team comparisons, key stats, and prediction breakdowns.
          </Typography>
          
          {/* Edge Grading Legend */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Edge Grading System:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {[
                { grade: 'A+', color: '#1b5e20', bg: '#e8f5e8', desc: '8%+ edge' },
                { grade: 'A', color: '#2e7d32', bg: '#e8f5e8', desc: '6-8% edge' },
                { grade: 'B+', color: '#388e3c', bg: '#f1f8e9', desc: '4.5-6% edge' },
                { grade: 'B', color: '#689f38', bg: '#f9fbe7', desc: '3-4.5% edge' },
                { grade: 'C+', color: '#afb42b', bg: '#fffde7', desc: '2-3% edge' },
                { grade: 'C', color: '#fbc02d', bg: '#fffde7', desc: '1-2% edge' },
                { grade: 'D', color: '#757575', bg: '#fafafa', desc: '<1% edge' }
              ].map((item) => (
                <Tooltip key={item.grade} title={item.desc}>
                  <Chip
                    label={item.grade}
                    size="small"
                    sx={{
                      backgroundColor: item.bg,
                      color: item.color,
                      fontWeight: 'bold',
                      fontSize: '0.7rem'
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>
          <Box sx={{ mt: 1 }}>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="edge-threshold-label">Edge Threshold</InputLabel>
              <Select
                labelId="edge-threshold-label"
                value={edgeThreshold.toString()}
                label="Edge Threshold"
                onChange={(e) => setEdgeThreshold(Number(e.target.value))}
              >
                <MenuItem value={2}>2% (More Opportunities)</MenuItem>
                <MenuItem value={3}>3% (Balanced)</MenuItem>
                <MenuItem value={5}>5% (Higher Confidence)</MenuItem>
                <MenuItem value={7}>7% (Strongest Edges Only)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>
        
        <Typography variant="subtitle2" color="text.secondary">
          Note: Predictions are updated twice weekly. Home field advantage is included in spread calculations.
          In a real app, market odds would be fetched from a live odds API.
        </Typography>
      </Box>
    </Box>
  );
};

export default Predictions;
