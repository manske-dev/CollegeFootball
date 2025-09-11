import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  useTheme,
  alpha,
  Stack,
  Divider,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { dummyTeamData } from '../../data/dummyData';

interface GameResult {
  date: string;
  opponent: string;
  location: 'H' | 'A' | 'N';
  result?: 'W' | 'L';
  score?: string;
  attendance?: number;
  opponentRank?: number;
}

const TeamSchedule: React.FC = () => {
  const theme = useTheme();
  const [selectedTeam, setSelectedTeam] = useState('Texas');

  const teamData = useMemo(() => {
    return dummyTeamData.find(team => team.name === selectedTeam);
  }, [selectedTeam]);

  // Mock schedule data based on the magazine format
  const scheduleData: GameResult[] = [
    { date: 'Aug 30', opponent: 'Ohio St', location: 'A', result: 'L', score: '21-28', attendance: 105000, opponentRank: 3 },
    { date: 'Sep 6', opponent: 'San Jose St', location: 'H', result: 'W', score: '42-14', attendance: 100119 },
    { date: 'Sep 13', opponent: 'UTEP', location: 'H', result: 'W', score: '35-7', attendance: 98543 },
    { date: 'Sep 20', opponent: 'Sam Houston', location: 'H', result: 'W', score: '28-10', attendance: 97821 },
    { date: 'Sep 27', opponent: 'BYU', location: 'A', result: 'W', score: '31-17', attendance: 63470 },
    { date: 'Oct 4', opponent: 'Florida', location: 'N', result: 'W', score: '24-21', attendance: 72000 },
    { date: 'Oct 11', opponent: 'Oklahoma', location: 'N', result: 'W', score: '35-28', attendance: 92100, opponentRank: 15 },
    { date: 'Oct 18', opponent: 'Kentucky', location: 'H', result: 'W', score: '42-21', attendance: 100119 },
    { date: 'Oct 25', opponent: 'Mississippi St', location: 'A', result: 'W', score: '28-14', attendance: 61337 },
    { date: 'Nov 1', opponent: 'Vanderbilt', location: 'H', result: 'W', score: '35-10', attendance: 98765 },
    { date: 'Nov 8', opponent: 'Arkansas', location: 'A', result: 'W', score: '31-24', attendance: 76212 },
    { date: 'Nov 15', opponent: 'Georgia', location: 'H', result: 'L', score: '21-28', attendance: 100119, opponentRank: 2 },
    { date: 'Nov 22', opponent: 'Arkansas', location: 'H', result: 'W', score: '38-17', attendance: 100119 },
    { date: 'Nov 29', opponent: 'Texas A&M', location: 'A', result: 'W', score: '17-7', attendance: 102733, opponentRank: 12 }
  ];

  // Mock statistical leaders data
  const statisticalLeaders = [
    { category: 'Passing Yards', player: 'Quinn Ewers', stats: '3,479 yds, 31 TD, 8 INT' },
    { category: 'Rushing Yards', player: 'Jaydon Blue', stats: '1,247 yds, 14 TD, 5.2 YPC' },
    { category: 'Receiving Yards', player: 'Isaiah Bond', stats: '1,156 yds, 12 TD, 18.1 YPR' },
    { category: 'Tackles', player: 'Anthony Hill Jr.', stats: '127 tackles, 8.5 TFL, 3 sacks' },
    { category: 'Sacks', player: 'Barryn Sorrell', stats: '11.5 sacks, 15 TFL, 2 FF' },
    { category: 'Interceptions', player: 'Jahdae Barron', stats: '6 INT, 12 PD, 1 TD' }
  ];

  const getLocationIcon = (location: 'H' | 'A' | 'N') => {
    switch (location) {
      case 'H': return '🏠';
      case 'A': return '✈️';
      case 'N': return '🏟️';
    }
  };

  const getResultColor = (result?: 'W' | 'L') => {
    if (!result) return theme.palette.grey[500];
    return result === 'W' ? theme.palette.success.main : theme.palette.error.main;
  };

  const teamOptions = dummyTeamData.map(team => team.name).sort();

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold', 
            background: `linear-gradient(135deg, ${teamData?.primaryColor || '#8B0000'} 0%, ${teamData?.secondaryColor || '#A52A2A'} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          {selectedTeam} {teamData?.mascot}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Complete season breakdown with game-by-game analysis
        </Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Team</InputLabel>
          <Select
            value={selectedTeam}
            label="Select Team"
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            {teamOptions.map((team) => (
              <MenuItem key={team} value={team}>{team}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Team Info Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${teamData?.primaryColor || '#8B0000'} 0%, ${alpha(teamData?.primaryColor || '#8B0000', 0.8)} 100%)`,
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    backgroundColor: teamData?.secondaryColor || 'white',
                    color: teamData?.primaryColor || '#8B0000',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    mr: 2
                  }}
                >
                  {selectedTeam.substring(0, 2).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {selectedTeam}
                  </Typography>
                  <Typography variant="subtitle1">
                    {teamData?.mascot}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
              
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Conference:</Typography>
                  <Typography variant="body2" fontWeight="bold">{teamData?.conference}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Stadium:</Typography>
                  <Typography variant="body2" fontWeight="bold">{teamData?.stadium}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Capacity:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {teamData?.stadiumCapacity?.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Power Rating:</Typography>
                  <Typography variant="body2" fontWeight="bold">{teamData?.powerRating}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Season Record & Stats */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                2025 Season Summary
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {scheduleData.filter(g => g.result === 'W').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Wins</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="error.main">
                      {scheduleData.filter(g => g.result === 'L').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Losses</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {scheduleData.filter(g => g.opponentRank).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">vs Ranked</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {Math.round(scheduleData.reduce((sum, g) => sum + (g.attendance || 0), 0) / scheduleData.length / 1000)}K
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Avg Attendance</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  Season Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(scheduleData.filter(g => g.result).length / scheduleData.length) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {scheduleData.filter(g => g.result).length} of {scheduleData.length} games completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Schedule Table */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          2025 Schedule & Results
        </Typography>
        
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: teamData?.primaryColor || '#8B0000' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Opponent</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Result</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Score</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleData.map((game, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' },
                    '&:hover': { backgroundColor: alpha(teamData?.primaryColor || '#8B0000', 0.1) }
                  }}
                >
                  <TableCell sx={{ fontWeight: 'bold' }}>{game.date}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {game.opponentRank && (
                        <Chip 
                          label={`#${game.opponentRank}`} 
                          size="small" 
                          color="primary" 
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                      <Typography fontWeight="bold">{game.opponent}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{getLocationIcon(game.location)}</span>
                      <Typography variant="body2">
                        {game.location === 'H' ? 'Home' : game.location === 'A' ? 'Away' : 'Neutral'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {game.result && (
                      <Chip 
                        label={game.result} 
                        size="small"
                        sx={{ 
                          backgroundColor: getResultColor(game.result),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{game.score || 'TBD'}</TableCell>
                  <TableCell>{game.attendance?.toLocaleString() || 'TBD'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Statistical Leaders */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          2025 Statistical Leaders
        </Typography>
        
        <Grid container spacing={2}>
          {statisticalLeaders.map((leader, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                    {leader.category}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {leader.player}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {leader.stats}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Game-by-Game Analysis Note */}
      <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Analysis Notes:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Home games show strong attendance averaging {Math.round(scheduleData.filter(g => g.location === 'H').reduce((sum, g) => sum + (g.attendance || 0), 0) / scheduleData.filter(g => g.location === 'H').length / 1000)}K fans<br/>
          • {scheduleData.filter(g => g.result === 'W' && g.opponentRank).length} wins against ranked opponents demonstrates strength of schedule<br/>
          • Season record of {scheduleData.filter(g => g.result === 'W').length}-{scheduleData.filter(g => g.result === 'L').length} positions team well for postseason consideration
        </Typography>
      </Box>
    </Box>
  );
};

export default TeamSchedule;
