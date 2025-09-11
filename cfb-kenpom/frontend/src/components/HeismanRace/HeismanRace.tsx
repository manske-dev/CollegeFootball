import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Stack,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  EmojiEvents,
} from '@mui/icons-material';
import { heismanCandidates } from '../../data/heismanData';

const HeismanRace: React.FC = () => {
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return '#1976d2';
      case 'RB': return '#388e3c';
      case 'WR': return '#f57c00';
      case 'TE': return '#7b1fa2';
      default: return '#616161';
    }
  };
  
  const chartData = heismanCandidates.slice(0, 10).map(candidate => ({
    name: candidate.name.split(' ').pop(),
    score: candidate.heismanScore,
  }));
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <EmojiEvents sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          Heisman Trophy Race
        </Typography>
      </Box>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Track the top contenders for college football's most prestigious individual award.
      </Typography>
      
      {/* Chart */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Top 10 Candidates - Heisman Scores</Typography>
        <Box sx={{ height: 400, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="score" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
      
      {/* Rankings */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Current Rankings</Typography>
        <Stack spacing={2}>
          {heismanCandidates.slice(0, 10).map((candidate, index) => (
            <Card key={candidate.id}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ minWidth: 30 }}>
                      #{index + 1}
                    </Typography>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {candidate.name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip 
                          label={candidate.position} 
                          size="small" 
                          sx={{ bgcolor: getPositionColor(candidate.position), color: 'white' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {candidate.team} • {candidate.conference}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {candidate.heismanScore.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Heisman Score
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(candidate.heismanScore, 100)} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default HeismanRace;
