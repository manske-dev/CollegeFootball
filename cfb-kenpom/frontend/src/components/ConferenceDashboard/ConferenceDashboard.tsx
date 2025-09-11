import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Tabs,
  Tab,
  Stack,
  Divider
} from '@mui/material';
import { dummyTeamData } from '../../data/dummyData';

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
      id={`conference-tabpanel-${index}`}
      aria-labelledby={`conference-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ConferenceDashboard: React.FC = () => {
  const theme = useTheme();
  const [selectedConference, setSelectedConference] = useState('SEC');
  const [tabValue, setTabValue] = useState(0);

  const conferences = ['SEC', 'Big Ten', 'Big 12', 'ACC', 'Pac-12'];

  const conferenceTeams = useMemo(() => {
    return dummyTeamData.filter(team => team.conference === selectedConference);
  }, [selectedConference]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getPerformanceTier = (value: number, metric: string) => {
    // Color coding based on performance tiers like the magazine
    if (metric === 'powerRating') {
      if (value >= 27) return { color: '#1B5E20', bg: '#E8F5E8' }; // Dark green
      if (value >= 24) return { color: '#2E7D32', bg: '#F1F8E9' }; // Green
      if (value >= 21) return { color: '#558B2F', bg: '#F9FBE7' }; // Light green
      if (value >= 18) return { color: '#F57F17', bg: '#FFFDE7' }; // Yellow
      return { color: '#D32F2F', bg: '#FFEBEE' }; // Red
    }
    if (metric === 'ypp') {
      if (value >= 6.5) return { color: '#1B5E20', bg: '#E8F5E8' };
      if (value >= 6.0) return { color: '#2E7D32', bg: '#F1F8E9' };
      if (value >= 5.5) return { color: '#558B2F', bg: '#F9FBE7' };
      if (value >= 5.0) return { color: '#F57F17', bg: '#FFFDE7' };
      return { color: '#D32F2F', bg: '#FFEBEE' };
    }
    return { color: theme.palette.text.primary, bg: 'transparent' };
  };

  const StatCell: React.FC<{ value: number; metric: string; suffix?: string }> = ({ 
    value, 
    metric, 
    suffix = '' 
  }) => {
    const tier = getPerformanceTier(value, metric);
    return (
      <TableCell 
        align="center" 
        sx={{ 
          fontSize: '0.75rem',
          fontWeight: 600,
          color: tier.color,
          backgroundColor: tier.bg,
          border: '1px solid #e0e0e0',
          padding: '4px 8px'
        }}
      >
        {value.toFixed(1)}{suffix}
      </TableCell>
    );
  };

  const OffensiveStatsTable = () => (
    <TableContainer component={Paper} elevation={0} sx={{ border: '2px solid #8B0000' }}>
      <Table size="small" sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#8B0000' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>
              {selectedConference} OFFENSIVE TEAM STATS
            </TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>PWR</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>YPP</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>APPD</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>EPA</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>EXP</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>3RD</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>RZ%</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>TO</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conferenceTeams
            .sort((a, b) => b.powerRating - a.powerRating)
            .map((team, index) => (
            <TableRow key={team.id} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' } }}>
              <TableCell sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600,
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Typography variant="caption" sx={{ minWidth: '16px', fontWeight: 'bold' }}>
                  {index + 1}.
                </Typography>
                <Avatar 
                  sx={{ 
                    width: 20, 
                    height: 20, 
                    backgroundColor: team.primaryColor,
                    fontSize: '0.6rem',
                    fontWeight: 'bold'
                  }}
                >
                  {team.name.substring(0, 2).toUpperCase()}
                </Avatar>
                {team.name}
              </TableCell>
              <StatCell value={team.powerRating} metric="powerRating" />
              <StatCell value={team.ypp} metric="ypp" />
              <StatCell value={team.appd} metric="appd" />
              <StatCell value={team.qbEpa} metric="qbEpa" />
              <StatCell value={team.explosivePlayDiff} metric="explosivePlayDiff" />
              <StatCell value={team.thirdDownDiff * 100} metric="thirdDownDiff" suffix="%" />
              <StatCell value={team.redZoneTdPctDiff * 100} metric="redZoneTdPctDiff" suffix="%" />
              <StatCell value={team.turnoverMargin} metric="turnoverMargin" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const DefensiveStatsTable = () => (
    <TableContainer component={Paper} elevation={0} sx={{ border: '2px solid #8B0000' }}>
      <Table size="small" sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#8B0000' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>
              {selectedConference} DEFENSIVE TEAM STATS
            </TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>DEF</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>YAPG</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>SUC%</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>HAV</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>LYC</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>FLD</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>SPP</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>HFA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conferenceTeams
            .sort((a, b) => b.defensiveSuccessRate - a.defensiveSuccessRate)
            .map((team, index) => (
            <TableRow key={team.id} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' } }}>
              <TableCell sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600,
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Typography variant="caption" sx={{ minWidth: '16px', fontWeight: 'bold' }}>
                  {index + 1}.
                </Typography>
                <Avatar 
                  sx={{ 
                    width: 20, 
                    height: 20, 
                    backgroundColor: team.primaryColor,
                    fontSize: '0.6rem',
                    fontWeight: 'bold'
                  }}
                >
                  {team.name.substring(0, 2).toUpperCase()}
                </Avatar>
                {team.name}
              </TableCell>
              <StatCell value={team.powerRating - 5} metric="powerRating" />
              <StatCell value={team.ypp * 0.8} metric="ypp" />
              <StatCell value={team.defensiveSuccessRate * 100} metric="defensiveSuccessRate" suffix="%" />
              <StatCell value={team.havocRate * 100} metric="havocRate" suffix="%" />
              <StatCell value={team.lineYardsPerCarry} metric="lineYardsPerCarry" />
              <StatCell value={team.fieldPositionDiff} metric="fieldPositionDiff" />
              <StatCell value={team.secondsPerPlay} metric="secondsPerPlay" />
              <StatCell value={team.homeFieldAdvantage} metric="homeFieldAdvantage" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const ConferenceOverview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
              Conference Leaders
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                <Typography variant="body2">Top Power Rating:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {conferenceTeams.reduce((max, team) => team.powerRating > max.powerRating ? team : max).name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                <Typography variant="body2">Best Offense:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {conferenceTeams.reduce((max, team) => team.ypp > max.ypp ? team : max).name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                <Typography variant="body2">Best Defense:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {conferenceTeams.reduce((max, team) => team.defensiveSuccessRate > max.defensiveSuccessRate ? team : max).name}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Conference Averages
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Avg Power Rating:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {(conferenceTeams.reduce((sum, team) => sum + team.powerRating, 0) / conferenceTeams.length).toFixed(1)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Avg YPP:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {(conferenceTeams.reduce((sum, team) => sum + team.ypp, 0) / conferenceTeams.length).toFixed(1)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Avg Def Success:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {((conferenceTeams.reduce((sum, team) => sum + team.defensiveSuccessRate, 0) / conferenceTeams.length) * 100).toFixed(1)}%
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Strength Metrics
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Teams:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {conferenceTeams.length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Avg SOS:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {(conferenceTeams.reduce((sum, team) => sum + team.sos, 0) / conferenceTeams.length).toFixed(1)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Top 25 Teams:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {conferenceTeams.filter(team => team.powerRating >= 22).length}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

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
          Conference Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Comprehensive statistical analysis by conference - Magazine-style breakdowns
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

      {/* Conference Overview Cards */}
      <Box sx={{ mb: 4 }}>
        <ConferenceOverview />
      </Box>

      {/* Tabs for Offensive/Defensive Stats */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 'bold',
              fontSize: '1rem'
            }
          }}
        >
          <Tab label="Offensive Stats" />
          <Tab label="Defensive Stats" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <OffensiveStatsTable />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <DefensiveStatsTable />
        </TabPanel>
      </Paper>

      {/* Legend */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Statistical Legend:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" display="block">
              <strong>PWR:</strong> Power Rating | <strong>YPP:</strong> Yards Per Play | <strong>APPD:</strong> Adjusted Points Per Drive
            </Typography>
            <Typography variant="caption" display="block">
              <strong>EPA:</strong> Expected Points Added | <strong>EXP:</strong> Explosive Play Differential
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" display="block">
              <strong>SUC%:</strong> Success Rate | <strong>HAV:</strong> Havoc Rate | <strong>LYC:</strong> Line Yards Per Carry
            </Typography>
            <Typography variant="caption" display="block">
              <strong>FLD:</strong> Field Position Diff | <strong>SPP:</strong> Seconds Per Play | <strong>HFA:</strong> Home Field Advantage
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ConferenceDashboard;
