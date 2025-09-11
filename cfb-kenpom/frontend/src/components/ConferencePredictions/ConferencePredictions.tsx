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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import { dummyTeamData } from '../../data/dummyData';

interface ConferencePrediction {
  team: string;
  predictedRecord: string;
  conferenceRecord: string;
  keyPlayers: string[];
  strengths: string[];
  concerns: string[];
  outlook: string;
  playoffOdds: number;
}

const ConferencePredictions: React.FC = () => {
  const theme = useTheme();
  const [selectedConference, setSelectedConference] = useState('SEC');

  const conferences = ['SEC', 'Big Ten', 'Big 12', 'ACC', 'Pac-12'];

  const conferenceTeams = useMemo(() => {
    return dummyTeamData.filter(team => team.conference === selectedConference);
  }, [selectedConference]);

  // Mock prediction data based on magazine format
  const generatePredictions = (teams: typeof dummyTeamData): ConferencePrediction[] => {
    return teams.map(team => ({
      team: team.name,
      predictedRecord: `${Math.max(6, Math.min(12, Math.round(8 + (team.powerRating - 20) * 0.3)))}-${Math.max(0, Math.min(6, 12 - Math.round(8 + (team.powerRating - 20) * 0.3)))}`,
      conferenceRecord: `${Math.max(3, Math.min(9, Math.round(5 + (team.powerRating - 20) * 0.2)))}-${Math.max(0, Math.min(6, 8 - Math.round(5 + (team.powerRating - 20) * 0.2)))}`,
      keyPlayers: ['QB John Smith', 'RB Mike Johnson', 'WR David Wilson'],
      strengths: team.powerRating > 25 ? ['Elite offense', 'Strong defense', 'Experienced coaching'] : 
                 team.powerRating > 20 ? ['Solid fundamentals', 'Good recruiting', 'Home field advantage'] :
                 ['Young talent', 'Improved depth', 'New schemes'],
      concerns: team.powerRating > 25 ? ['Injury depth', 'Schedule difficulty'] :
                team.powerRating > 20 ? ['Consistency', 'Road games', 'Key departures'] :
                ['Experience', 'Depth issues', 'Tough conference'],
      outlook: team.powerRating > 27 ? 'Championship contender with playoff aspirations. Strong on both sides of the ball.' :
               team.powerRating > 24 ? 'Bowl eligible with potential for conference title game appearance.' :
               team.powerRating > 20 ? 'Building program with bowl game as realistic goal.' :
               'Rebuilding year with focus on development and future.',
      playoffOdds: Math.max(0, Math.min(95, (team.powerRating - 15) * 5))
    }));
  };

  const predictions = useMemo(() => {
    return generatePredictions(conferenceTeams).sort((a, b) => {
      const aWins = parseInt(a.predictedRecord.split('-')[0]);
      const bWins = parseInt(b.predictedRecord.split('-')[0]);
      return bWins - aWins;
    });
  }, [conferenceTeams]);

  const getTeamData = (teamName: string) => {
    return dummyTeamData.find(team => team.name === teamName);
  };

  const getRecordColor = (record: string) => {
    const wins = parseInt(record.split('-')[0]);
    if (wins >= 10) return theme.palette.success.main;
    if (wins >= 8) return theme.palette.warning.main;
    if (wins >= 6) return theme.palette.info.main;
    return theme.palette.error.main;
  };

  const getPlayoffOddsColor = (odds: number) => {
    if (odds >= 70) return '#1B5E20';
    if (odds >= 40) return '#2E7D32';
    if (odds >= 20) return '#558B2F';
    if (odds >= 10) return '#F57F17';
    return '#D32F2F';
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          2025 Conference Predictions
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Phil Steele-style preseason forecasts and team outlooks
        </Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Conference</InputLabel>
          <Select
            value={selectedConference}
            label="Conference"
            onChange={(e) => setSelectedConference(e.target.value)}
          >
            {conferences.map((conf) => (
              <MenuItem key={conf} value={conf}>{conf}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Conference Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                {selectedConference} Forecast
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                  <Typography variant="body2">Predicted Champion:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {predictions[0]?.team}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                  <Typography variant="body2">Playoff Teams:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {predictions.filter(p => p.playoffOdds > 50).length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                  <Typography variant="body2">Bowl Eligible:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {predictions.filter(p => parseInt(p.predictedRecord.split('-')[0]) >= 6).length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Conference Storylines
              </Typography>
              <Stack spacing={2}>
                <Typography variant="body2">
                  <strong>Title Race:</strong> {predictions[0]?.team} enters as the favorite after a strong recruiting class and returning production. 
                  {predictions[1]?.team} and {predictions[2]?.team} will provide stiff competition.
                </Typography>
                <Typography variant="body2">
                  <strong>Playoff Picture:</strong> The {selectedConference} should send {predictions.filter(p => p.playoffOdds > 30).length} teams 
                  to the expanded playoff, with {predictions.filter(p => p.playoffOdds > 70).length} having legitimate championship aspirations.
                </Typography>
                <Typography variant="body2">
                  <strong>Sleeper Teams:</strong> Watch for {predictions.slice(4, 6).map(p => p.team).join(' and ')} to potentially 
                  exceed expectations with improved coaching and talent development.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Predictions Table */}
      <Paper elevation={2} sx={{ mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#8B0000' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Team</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Predicted Record</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Conference</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Playoff Odds</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Outlook</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {predictions.map((prediction, index) => {
                const teamData = getTeamData(prediction.team);
                return (
                  <TableRow 
                    key={prediction.team}
                    sx={{ 
                      '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' },
                      '&:hover': { backgroundColor: alpha(teamData?.primaryColor || '#8B0000', 0.1) }
                    }}
                  >
                    <TableCell>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            backgroundColor: teamData?.primaryColor,
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {prediction.team.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="bold">{prediction.team}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {teamData?.mascot}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={prediction.predictedRecord}
                        sx={{ 
                          backgroundColor: getRecordColor(prediction.predictedRecord),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {prediction.conferenceRecord}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight="bold"
                          sx={{ color: getPlayoffOddsColor(prediction.playoffOdds) }}
                        >
                          {prediction.playoffOdds.toFixed(0)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {prediction.outlook}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Detailed Team Breakdowns */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Detailed Team Analysis
      </Typography>
      
      <Grid container spacing={3}>
        {predictions.slice(0, 6).map((prediction) => {
          const teamData = getTeamData(prediction.team);
          return (
            <Grid item xs={12} md={6} key={prediction.team}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        backgroundColor: teamData?.primaryColor,
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {prediction.team.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {prediction.team}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Predicted: {prediction.predictedRecord} ({prediction.conferenceRecord} conf)
                      </Typography>
                    </Box>
                  </Box>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                        Key Strengths:
                      </Typography>
                      <List dense>
                        {prediction.strengths.map((strength, idx) => (
                          <ListItem key={idx} sx={{ py: 0, px: 1 }}>
                            <Typography variant="body2">• {strength}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color="warning.main">
                        Concerns:
                      </Typography>
                      <List dense>
                        {prediction.concerns.map((concern, idx) => (
                          <ListItem key={idx} sx={{ py: 0, px: 1 }}>
                            <Typography variant="body2">• {concern}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                        Key Players:
                      </Typography>
                      <Typography variant="body2">
                        {prediction.keyPlayers.join(', ')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Bottom Analysis */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          {selectedConference} Conference Analysis
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Playoff Contenders:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {predictions.filter(p => p.playoffOdds > 50).map(p => p.team).join(', ')} have the best 
              chances to make the expanded College Football Playoff based on talent, schedule, and coaching.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Dark Horses:
            </Typography>
            <Typography variant="body2">
              {predictions.slice(3, 6).map(p => p.team).join(', ')} could surprise if everything breaks right. 
              Watch for improved recruiting classes and coaching changes to pay dividends.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ConferencePredictions;
