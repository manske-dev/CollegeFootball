import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Chip, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import { dummyTeamData, gamesPredictions, getTeamSchedule, getNextGame, type GameSchedule } from '../../data/dummyData';

const TeamDetail = () => {
  const theme = useTheme(); // Used for theme-aware styling
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const { id } = useParams<{ id: string }>();
  const teamId = parseInt(id || '1');
  
  const team = dummyTeamData.find(t => t.id === teamId) || dummyTeamData[0];
  
  // Create radar chart data
  const radarData = [
    { metric: 'APPD', value: team.appd / 3 * 100 },
    { metric: 'Def Success', value: team.defensiveSuccessRate * 100 },
    { metric: 'Explosive Plays', value: team.explosivePlayDiff / 6 * 100 },
    { metric: '3rd Down', value: team.thirdDownDiff * 100 + 50 },
    { metric: 'TO Margin', value: team.turnoverMargin / 1.5 * 50 + 50 },
    { metric: 'Field Pos', value: team.fieldPositionDiff / 10 * 100 }
  ];
  
  // Create comparison data for bar chart
  const comparisonData = [
    { name: 'Power Rating', team: team.powerRating, avg: 20 },
    { name: 'APPD', team: team.appd, avg: 2.0 },
    { name: 'Def Success', team: team.defensiveSuccessRate * 100, avg: 65 },
    { name: 'Explosive Diff', team: team.explosivePlayDiff, avg: 3.0 },
    { name: '3rd Down Diff', team: team.thirdDownDiff * 100, avg: 8 },
    { name: 'TO Margin', team: team.turnoverMargin, avg: 0.5 }
  ];
  
  // Get 2025 schedule for this team
  const teamSchedule = getTeamSchedule(team.name);
  const nextGame = getNextGame(team.name);
  
  // Filter games for this team from predictions (for backward compatibility)
  const teamGames = gamesPredictions.filter(
    game => game.homeTeam === team.name || game.awayTeam === team.name
  );

  // Calculate team ranks for various metrics
  const powerRatingRank = dummyTeamData.sort((a, b) => b.powerRating - a.powerRating).findIndex(t => t.id === team.id) + 1;
  
  // Calculate win-loss record from predictions
  const wins = teamGames.filter(game => 
    (game.homeTeam === team.name && game.winProbability > 0.5) || 
    (game.awayTeam === team.name && game.winProbability < 0.5)
  ).length;
  const losses = teamGames.length - wins;
  
  // Helper function to format game display
  const formatGameDisplay = (game: GameSchedule) => {
    const isHome = game.location === 'home';
    const isAway = game.location === 'away';
    
    if (isHome) {
      return `vs ${game.opponent}`;
    } else if (isAway) {
      return `@ ${game.opponent}`;
    } else {
      return `vs ${game.opponent} (${game.venue || 'Neutral Site'})`;
    }
  };
  
  const getLocationColor = (location: string) => {
    switch (location) {
      case 'home': return '#4caf50';
      case 'away': return '#f44336';
      case 'neutral': return '#ff9800';
      default: return '#2196f3';
    }
  };
  
  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      {/* Team Header */}
      <Paper 
        elevation={8} 
        sx={{ 
          padding: { xs: 3, md: 4 },
          background: `
            linear-gradient(135deg, ${team.primaryColor} 0%, ${alpha(team.primaryColor, 0.9)} 50%, ${alpha(team.primaryColor, 0.7)} 100%),
            radial-gradient(circle at top right, ${alpha('#fff', 0.1)} 0%, transparent 50%)
          `,
          color: team.secondaryColor,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `
            0 20px 40px ${alpha(team.primaryColor, 0.3)},
            0 8px 16px ${alpha(team.primaryColor, 0.2)},
            inset 0 1px 0 ${alpha('#fff', 0.1)}
          `,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, ${alpha('#fff', 0.1)} 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${alpha('#fff', 0.05)} 0%, transparent 50%)
            `,
            pointerEvents: 'none'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent 0%, ${alpha('#fff', 0.1)} 50%, transparent 100%)`,
            animation: 'shimmer 3s ease-in-out infinite',
            pointerEvents: 'none'
          },
          '@keyframes shimmer': {
            '0%': { left: '-100%' },
            '100%': { left: '100%' }
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', lg: 'center' },
          gap: 3
        }}>
          <Box sx={{ flex: 1 }}>
            {/* Team Name and Mascot */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `
                  linear-gradient(135deg, ${alpha(team.secondaryColor, 0.2)} 0%, ${alpha(team.secondaryColor, 0.1)} 100%)
                `,
                border: `3px solid ${alpha(team.secondaryColor, 0.3)}`,
                boxShadow: `
                  0 8px 16px ${alpha('#000', 0.2)},
                  inset 0 2px 4px ${alpha('#fff', 0.1)}
                `,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '50%',
                  background: `conic-gradient(from 0deg, ${team.secondaryColor}, transparent, ${team.secondaryColor})`,
                  mask: 'radial-gradient(circle, transparent 70%, black 71%)',
                  animation: 'rotate 3s linear infinite'
                },
                '@keyframes rotate': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}>
                <SportsTennisIcon sx={{ fontSize: 40, color: team.secondaryColor, zIndex: 1 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h2" 
                  fontWeight="900" 
                  sx={{ 
                    lineHeight: 0.9,
                    textShadow: `
                      0 4px 8px ${alpha('#000', 0.3)},
                      0 2px 4px ${alpha('#000', 0.2)}
                    `,
                    letterSpacing: '-0.02em',
                    background: `linear-gradient(135deg, ${team.secondaryColor} 0%, ${alpha(team.secondaryColor, 0.8)} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 0.5
                  }}
                >
                  {team.name}
                </Typography>
                {team.mascot && (
                  <Typography variant="h5" sx={{ 
                    opacity: 0.95, 
                    fontWeight: 400,
                    fontStyle: 'italic',
                    textShadow: `0 2px 4px ${alpha('#000', 0.2)}`,
                    letterSpacing: '0.5px'
                  }}>
                    {team.mascot}
                  </Typography>
                )}
              </Box>
            </Box>
            
            {/* Stadium Information */}
            {team.stadium && (
              <Box sx={{ 
                mb: 3,
                p: 2.5,
                borderRadius: 2,
                background: `
                  linear-gradient(135deg, ${alpha(team.secondaryColor, 0.08)} 0%, ${alpha(team.secondaryColor, 0.04)} 100%)
                `,
                border: `1px solid ${alpha(team.secondaryColor, 0.2)}`,
                boxShadow: `
                  0 4px 12px ${alpha('#000', 0.1)},
                  inset 0 1px 0 ${alpha('#fff', 0.1)}
                `,
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `
                    0 8px 20px ${alpha('#000', 0.15)},
                    inset 0 1px 0 ${alpha('#fff', 0.2)}
                  `
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    fontSize: '2rem',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }}>
                    🏟️
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700,
                      color: team.secondaryColor,
                      textShadow: `0 1px 2px ${alpha('#000', 0.1)}`,
                      mb: 0.5
                    }}>
                      {team.stadium}
                    </Typography>
                    {team.stadiumCapacity && (
                      <Typography variant="body2" sx={{ 
                        opacity: 0.9,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        <Box component="span" sx={{ 
                          display: 'inline-block',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: alpha(team.secondaryColor, 0.6)
                        }} />
                        {team.stadiumCapacity.toLocaleString()} capacity
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
            
            {/* Conference and Record Chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
              <Chip 
                label={team.conference} 
                size="medium" 
                sx={{ 
                  background: `linear-gradient(135deg, ${alpha(team.secondaryColor, 0.25)} 0%, ${alpha(team.secondaryColor, 0.15)} 100%)`,
                  color: team.secondaryColor,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: `2px solid ${alpha(team.secondaryColor, 0.4)}`,
                  boxShadow: `
                    0 4px 8px ${alpha('#000', 0.1)},
                    inset 0 1px 0 ${alpha('#fff', 0.2)}
                  `,
                  textShadow: `0 1px 2px ${alpha('#000', 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `
                      0 6px 12px ${alpha('#000', 0.15)},
                      inset 0 1px 0 ${alpha('#fff', 0.3)}
                    `
                  }
                }} 
              />
              <Chip 
                label={`${wins}-${losses} Projected`} 
                size="medium"
                sx={{ 
                  background: `linear-gradient(135deg, ${alpha(team.secondaryColor, 0.25)} 0%, ${alpha(team.secondaryColor, 0.15)} 100%)`,
                  color: team.secondaryColor,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: `2px solid ${alpha(team.secondaryColor, 0.4)}`,
                  boxShadow: `
                    0 4px 8px ${alpha('#000', 0.1)},
                    inset 0 1px 0 ${alpha('#fff', 0.2)}
                  `,
                  textShadow: `0 1px 2px ${alpha('#000', 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `
                      0 6px 12px ${alpha('#000', 0.15)},
                      inset 0 1px 0 ${alpha('#fff', 0.3)}
                    `
                  }
                }} 
              />
              <Chip 
                label={`+${team.homeFieldAdvantage} HFA`} 
                size="medium"
                sx={{ 
                  background: `linear-gradient(135deg, ${alpha('#4caf50', 0.3)} 0%, ${alpha('#4caf50', 0.2)} 100%)`,
                  color: team.secondaryColor,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: `2px solid ${alpha('#4caf50', 0.5)}`,
                  boxShadow: `
                    0 4px 8px ${alpha('#4caf50', 0.2)},
                    inset 0 1px 0 ${alpha('#fff', 0.2)}
                  `,
                  textShadow: `0 1px 2px ${alpha('#000', 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `
                      0 6px 12px ${alpha('#4caf50', 0.3)},
                      inset 0 1px 0 ${alpha('#fff', 0.3)}
                    `
                  }
                }} 
              />
            </Box>
            
            {/* Key Stats Row */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              mt: 1
            }}>
              <Box sx={{ 
                textAlign: 'center',
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(team.secondaryColor, 0.1)} 0%, ${alpha(team.secondaryColor, 0.05)} 100%)`,
                border: `1px solid ${alpha(team.secondaryColor, 0.2)}`,
                boxShadow: `0 2px 8px ${alpha('#000', 0.1)}`,
                minWidth: 100,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 16px ${alpha('#000', 0.15)}`
                }
              }}>
                <Typography variant="h5" fontWeight="900" sx={{
                  color: team.secondaryColor,
                  textShadow: `0 1px 2px ${alpha('#000', 0.1)}`
                }}>
                  {(team.marketSentiment * 100).toFixed(0)}%
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: 0.9,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Market Sentiment
                </Typography>
              </Box>
              <Box sx={{ 
                textAlign: 'center',
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(team.secondaryColor, 0.1)} 0%, ${alpha(team.secondaryColor, 0.05)} 100%)`,
                border: `1px solid ${alpha(team.secondaryColor, 0.2)}`,
                boxShadow: `0 2px 8px ${alpha('#000', 0.1)}`,
                minWidth: 100,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 16px ${alpha('#000', 0.15)}`
                }
              }}>
                <Typography variant="h5" fontWeight="900" sx={{
                  color: team.secondaryColor,
                  textShadow: `0 1px 2px ${alpha('#000', 0.1)}`
                }}>
                  {team.qbEpa.toFixed(1)}
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: 0.9,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  QB EPA
                </Typography>
              </Box>
              <Box sx={{ 
                textAlign: 'center',
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(team.secondaryColor, 0.1)} 0%, ${alpha(team.secondaryColor, 0.05)} 100%)`,
                border: `1px solid ${alpha(team.secondaryColor, 0.2)}`,
                boxShadow: `0 2px 8px ${alpha('#000', 0.1)}`,
                minWidth: 100,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 16px ${alpha('#000', 0.15)}`
                }
              }}>
                <Typography variant="h5" fontWeight="900" sx={{
                  color: team.secondaryColor,
                  textShadow: `0 1px 2px ${alpha('#000', 0.1)}`
                }}>
                  {(team.defensiveSuccessRate * 100).toFixed(0)}%
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: 0.9,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Def Success Rate
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: { xs: 'center', lg: 'flex-end' },
            gap: 1,
            minWidth: { lg: '200px' },
            textAlign: { xs: 'center', lg: 'right' }
          }}>
            {/* Power Rating Display */}
            <Box sx={{ 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              borderRadius: 3,
              background: `
                linear-gradient(135deg, ${alpha(team.secondaryColor, 0.15)} 0%, ${alpha(team.secondaryColor, 0.08)} 100%),
                radial-gradient(circle at center, ${alpha('#fff', 0.1)} 0%, transparent 70%)
              `,
              border: `3px solid ${alpha(team.secondaryColor, 0.4)}`,
              minWidth: '160px',
              boxShadow: `
                0 12px 24px ${alpha('#000', 0.2)},
                0 4px 8px ${alpha('#000', 0.1)},
                inset 0 2px 4px ${alpha('#fff', 0.1)}
              `
            }}>
              <Typography variant="caption" sx={{ 
                opacity: 0.8,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase'
              }}>
                Power Rating
              </Typography>
              <Typography variant="h1" fontWeight="900" sx={{ 
                lineHeight: 0.8,
                fontSize: { xs: '3rem', md: '4rem' },
                background: `linear-gradient(135deg, ${team.secondaryColor} 0%, ${alpha(team.secondaryColor, 0.7)} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: `
                  0 4px 8px ${alpha('#000', 0.3)},
                  0 2px 4px ${alpha('#000', 0.2)}
                `,
                position: 'relative',
                zIndex: 1
              }}>
                {team.powerRating.toFixed(1)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Rank
                </Typography>
                <Chip 
                  label={`#${powerRatingRank}`} 
                  size="small" 
                  sx={{ 
                    backgroundColor: alpha(team.secondaryColor, 0.3),
                    color: team.primaryColor,
                    fontWeight: 900,
                    fontSize: '0.8rem'
                  }}
                />
              </Box>
            </Box>
            
            {/* Additional Context Stats */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'row', lg: 'column' },
              gap: 1,
              mt: 1
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" fontWeight="bold">
                  {team.sos.toFixed(1)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  SOS
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" fontWeight="bold">
                  {team.closingLineValue > 0 ? '+' : ''}{team.closingLineValue.toFixed(1)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Line Value
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3, mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ 
            '& .MuiTab-root': { 
              fontWeight: 600,
              fontSize: '0.9rem',
              minHeight: 48
            } 
          }}
        >
          <Tab 
            label="Team Metrics" 
            icon={<AssessmentIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label="Comparisons" 
            icon={<CompareArrowsIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label="Game Predictions" 
            icon={<CalendarTodayIcon />} 
            iconPosition="start" 
          />
        </Tabs>
      </Box>
      
      {/* Tab Content */}
      {/* Team Metrics Tab */}
      <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
        <Stack spacing={3}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Team Metrics</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">Rank</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05) } }}>
                        <TableCell>
                          <Tooltip title="Overall team strength rating">
                            <Typography variant="body2" fontWeight="medium">Power Rating</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{team.powerRating.toFixed(1)}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`#${powerRatingRank}`} 
                            size="small" 
                            color={powerRatingRank <= 25 ? "success" : powerRatingRank <= 50 ? "primary" : "default"}
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05) } }}>
                        <TableCell>
                          <Tooltip title="Adjusted Points Per Drive">
                            <Typography variant="body2" fontWeight="medium">Adjusted PPD</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{team.appd.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          {(() => {
                            const rank = dummyTeamData.sort((a, b) => b.appd - a.appd).findIndex(t => t.id === team.id) + 1;
                            return (
                              <Chip 
                                label={`#${rank}`} 
                                size="small" 
                                color={rank <= 25 ? "success" : rank <= 50 ? "primary" : "default"}
                                sx={{ fontWeight: 500 }}
                              />
                            );
                          })()} 
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05) } }}>
                        <TableCell>
                          <Tooltip title="Percentage of defensive plays that result in success">
                            <Typography variant="body2" fontWeight="medium">Defensive Success Rate</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{(team.defensiveSuccessRate * 100).toFixed(1)}%</TableCell>
                        <TableCell align="right">
                          {(() => {
                            const rank = dummyTeamData.sort((a, b) => b.defensiveSuccessRate - a.defensiveSuccessRate).findIndex(t => t.id === team.id) + 1;
                            return (
                              <Chip 
                                label={`#${rank}`} 
                                size="small" 
                                color={rank <= 25 ? "success" : rank <= 50 ? "primary" : "default"}
                                sx={{ fontWeight: 500 }}
                              />
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05) } }}>
                        <TableCell>
                          <Tooltip title="Difference between explosive plays gained and allowed">
                            <Typography variant="body2" fontWeight="medium">Explosive Play Differential</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{team.explosivePlayDiff.toFixed(1)}</TableCell>
                        <TableCell align="right">
                          {(() => {
                            const rank = dummyTeamData.sort((a, b) => b.explosivePlayDiff - a.explosivePlayDiff).findIndex(t => t.id === team.id) + 1;
                            return (
                              <Chip 
                                label={`#${rank}`} 
                                size="small" 
                                color={rank <= 25 ? "success" : rank <= 50 ? "primary" : "default"}
                                sx={{ fontWeight: 500 }}
                              />
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05) } }}>
                        <TableCell>
                          <Tooltip title="Difference between offensive and defensive 3rd down conversion rates">
                            <Typography variant="body2" fontWeight="medium">3rd Down Differential</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{(team.thirdDownDiff * 100).toFixed(1)}%</TableCell>
                        <TableCell align="right">
                          {(() => {
                            const rank = dummyTeamData.sort((a, b) => b.thirdDownDiff - a.thirdDownDiff).findIndex(t => t.id === team.id) + 1;
                            return (
                              <Chip 
                                label={`#${rank}`} 
                                size="small" 
                                color={rank <= 25 ? "success" : rank <= 50 ? "primary" : "default"}
                                sx={{ fontWeight: 500 }}
                              />
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05) } }}>
                        <TableCell>
                          <Tooltip title="Average turnover margin per game">
                            <Typography variant="body2" fontWeight="medium">Turnover Margin</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{team.turnoverMargin.toFixed(1)}</TableCell>
                        <TableCell align="right">
                          {(() => {
                            const rank = dummyTeamData.sort((a, b) => b.turnoverMargin - a.turnoverMargin).findIndex(t => t.id === team.id) + 1;
                            return (
                              <Chip 
                                label={`#${rank}`} 
                                size="small" 
                                color={rank <= 25 ? "success" : rank <= 50 ? "primary" : "default"}
                                sx={{ fontWeight: 500 }}
                              />
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05) } }}>
                        <TableCell>
                          <Tooltip title="Average starting field position difference between offense and defense">
                            <Typography variant="body2" fontWeight="medium">Field Position Differential</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{team.fieldPositionDiff.toFixed(1)}</TableCell>
                        <TableCell align="right">
                          {(() => {
                            const rank = dummyTeamData.sort((a, b) => b.fieldPositionDiff - a.fieldPositionDiff).findIndex(t => t.id === team.id) + 1;
                            return (
                              <Chip 
                                label={`#${rank}`} 
                                size="small" 
                                color={rank <= 25 ? "success" : rank <= 50 ? "primary" : "default"}
                                sx={{ fontWeight: 500 }}
                              />
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05) } }}>
                        <TableCell>
                          <Tooltip title="Strength of schedule rating based on opponent power ratings">
                            <Typography variant="body2" fontWeight="medium">Strength of Schedule</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{team.sos.toFixed(1)}</TableCell>
                        <TableCell align="right">
                          {(() => {
                            const rank = dummyTeamData.sort((a, b) => b.sos - a.sos).findIndex(t => t.id === team.id) + 1;
                            return (
                              <Chip 
                                label={`#${rank}`} 
                                size="small" 
                                color={rank <= 25 ? "success" : rank <= 50 ? "primary" : "default"}
                                sx={{ fontWeight: 500 }}
                              />
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Team Profile</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name={team.name} dataKey="value" stroke={team.primaryColor} fill={team.primaryColor} fillOpacity={0.6} />
                    <RechartsTooltip formatter={(value: number) => [`${value.toFixed(1)}`, 'Rating']} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>
        
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Comparison to National Average</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value: number) => [`${value.toFixed(1)}`, 'Rating']} />
                  <Legend />
                  <Bar dataKey="team" name={team.name} fill={team.primaryColor} />
                  <Bar dataKey="avg" name="National Avg" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
        
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Game Predictions</Typography>
              {teamGames.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Matchup</TableCell>
                        <TableCell align="right">Predicted Spread</TableCell>
                        <TableCell align="right">Predicted Total</TableCell>
                        <TableCell align="right">Win Probability</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teamGames.map(game => (
                        <TableRow key={game.id}>
                          <TableCell>{game.date}</TableCell>
                          <TableCell>{game.awayTeam} @ {game.homeTeam}</TableCell>
                          <TableCell align="right">
                            {game.homeTeam === team.name 
                              ? game.predictedSpread.toFixed(1) 
                              : (game.predictedSpread * -1).toFixed(1)}
                          </TableCell>
                          <TableCell align="right">{game.predictedTotal.toFixed(1)}</TableCell>
                          <TableCell align="right">
                            {game.homeTeam === team.name 
                              ? `${(game.winProbability * 100).toFixed(1)}%` 
                              : `${((1 - game.winProbability) * 100).toFixed(1)}%`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No upcoming games scheduled</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
        </Stack>
      </Box>
      
      {/* Schedule Tab */}
      <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
        <Stack spacing={2}>
          {/* Next Game Card */}
          {nextGame && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Next Game</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip 
                    label={nextGame.location.toUpperCase()} 
                    size="small" 
                    sx={{ 
                      backgroundColor: getLocationColor(nextGame.location),
                      color: 'white'
                    }} 
                  />
                  <Typography variant="body1">
                    <strong>{nextGame.date}</strong> - {formatGameDisplay(nextGame)}
                  </Typography>
                  {nextGame.rivalry && (
                    <Chip 
                      label={nextGame.rivalry} 
                      size="small" 
                      color="secondary" 
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          )}
          
          {/* Full 2025 Season Schedule */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>2025 Season Schedule</Typography>
              {teamSchedule.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Week</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Opponent</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Conference</TableCell>
                        <TableCell align="right">Projected Spread</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teamSchedule.map((game, index) => {
                        // Find matching game in predictions for navigation
                        const prediction = gamesPredictions.find(p => 
                          (p.homeTeam === team.name && p.awayTeam === game.opponent) || 
                          (p.awayTeam === team.name && p.homeTeam === game.opponent)
                        );
                        
                        return (
                          <TableRow 
                            key={index}
                            hover={!!prediction}
                            onClick={prediction ? () => navigate(`/game/${prediction.id}`) : undefined}
                            sx={{
                              backgroundColor: new Date(game.date) < new Date() 
                                ? alpha(theme.palette.grey[500], 0.1)
                                : 'inherit',
                              cursor: prediction ? 'pointer' : 'default',
                              '&:hover': prediction ? { backgroundColor: alpha(theme.palette.primary.main, 0.1) } : {}
                            }}
                          >
                          <TableCell>{game.week}</TableCell>
                          <TableCell>{game.date}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">{game.opponent}</Typography>
                              {game.rivalry && (
                                <Chip 
                                  label="Rivalry" 
                                  size="small" 
                                  color="error" 
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={game.location === 'home' ? 'HOME' : game.location === 'away' ? 'AWAY' : 'NEUTRAL'} 
                              size="small" 
                              sx={{ 
                                backgroundColor: getLocationColor(game.location),
                                color: 'white'
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={game.conference ? 'CONF' : 'NON-CONF'} 
                              size="small" 
                              variant={game.conference ? 'filled' : 'outlined'}
                              color={game.conference ? 'primary' : 'default'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {(() => {
                              // Find matching game in predictions if it exists
                              const prediction = gamesPredictions.find(p => 
                                (p.homeTeam === team.name && p.awayTeam === game.opponent) || 
                                (p.awayTeam === team.name && p.homeTeam === game.opponent)
                              );
                              
                              if (prediction) {
                                // Calculate spread from this team's perspective
                                const spread = prediction.homeTeam === team.name 
                                  ? prediction.predictedSpread 
                                  : -prediction.predictedSpread;
                                
                                // Display the spread
                                const spreadDisplay = spread > 0 
                                  ? `-${spread.toFixed(1)}` // Favored (negative spread)
                                  : spread < 0 
                                    ? `+${Math.abs(spread).toFixed(1)}` // Underdog (positive spread)
                                    : 'EVEN';
                                    
                                const color = spread > 0 
                                  ? theme.palette.success.main 
                                  : spread < 0 
                                    ? theme.palette.error.main 
                                    : theme.palette.text.primary;
                                    
                                return (
                                  <Typography 
                                    variant="body2" 
                                    fontWeight="bold" 
                                    sx={{ color }}
                                  >
                                    {spreadDisplay}
                                  </Typography>
                                );
                              } else {
                                return (
                                  <Typography variant="caption" color="text.secondary">
                                    N/A
                                  </Typography>
                                );
                              }
                            })()} 
                          </TableCell>
                          <TableCell>
                            {game.venue && (
                              <Typography variant="caption" color="textSecondary">
                                {game.venue}
                              </Typography>
                            )}
                            {game.rivalry && (
                              <Typography variant="caption" color="error">
                                {game.rivalry}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No 2025 schedule data available for this team</Typography>
              )}
            </CardContent>
          </Card>
          
          {/* Game Predictions (Legacy) */}
          {teamGames.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Game Predictions</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Matchup</TableCell>
                        <TableCell align="right">Predicted Spread</TableCell>
                        <TableCell align="right">Predicted Total</TableCell>
                        <TableCell align="right">Win Probability</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teamGames.map(game => (
                        <TableRow key={game.id}>
                          <TableCell>{game.date}</TableCell>
                          <TableCell>{game.awayTeam} @ {game.homeTeam}</TableCell>
                          <TableCell align="right">
                            {game.homeTeam === team.name 
                              ? game.predictedSpread.toFixed(1) 
                              : (game.predictedSpread * -1).toFixed(1)}
                          </TableCell>
                          <TableCell align="right">{game.predictedTotal.toFixed(1)}</TableCell>
                          <TableCell align="right">
                            {game.homeTeam === team.name 
                              ? `${(game.winProbability * 100).toFixed(1)}%` 
                              : `${((1 - game.winProbability) * 100).toFixed(1)}%`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Box>
      
      {/* Comparisons Tab */}
      <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Comparison to National Average</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="team" name={team.name} fill={team.primaryColor} />
                <Bar dataKey="avg" name="National Avg" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
      
      {/* Game Predictions Tab */}
      <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Game Predictions</Typography>
            {teamGames.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Matchup</TableCell>
                      <TableCell align="right">Predicted Spread</TableCell>
                      <TableCell align="right">Predicted Total</TableCell>
                      <TableCell align="right">Win Probability</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamGames.map(game => (
                      <TableRow 
                        key={game.id}
                        hover
                        onClick={() => navigate(`/game/${game.id}`)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                        }}
                      >
                        <TableCell>{game.date}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {game.awayTeam} @ {game.homeTeam}
                            <Tooltip title="Click for detailed matchup analysis">
                              <CompareArrowsIcon color="primary" fontSize="small" sx={{ ml: 1 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {game.homeTeam === team.name 
                            ? game.predictedSpread.toFixed(1) 
                            : (game.predictedSpread * -1).toFixed(1)}
                        </TableCell>
                        <TableCell align="right">{game.predictedTotal.toFixed(1)}</TableCell>
                        <TableCell align="right">
                          {game.homeTeam === team.name 
                            ? `${(game.winProbability * 100).toFixed(1)}%` 
                            : `${((1 - game.winProbability) * 100).toFixed(1)}%`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No upcoming games scheduled</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default TeamDetail;
