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
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import { dummyTeamData } from '../../data/dummyData';

interface PlayerProjection {
  name: string;
  position: string;
  year: string;
  height: string;
  weight: string;
  projectedStats: {
    passing?: { yards: number; tds: number; ints: number; completion: number };
    rushing?: { yards: number; tds: number; ypc: number; carries: number };
    receiving?: { yards: number; tds: number; receptions: number; ypr: number };
    defense?: { tackles: number; sacks: number; ints: number; pbu: number };
  };
  grade: string;
  outlook: string;
}

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
      id={`player-tabpanel-${index}`}
      aria-labelledby={`player-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PlayerProjections: React.FC = () => {
  const theme = useTheme();
  const [selectedTeam, setSelectedTeam] = useState('Texas');
  const [tabValue, setTabValue] = useState(0);

  const teamData = useMemo(() => {
    return dummyTeamData.find(team => team.name === selectedTeam);
  }, [selectedTeam]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock player projection data
  const generatePlayerProjections = (teamName: string): { [key: string]: PlayerProjection[] } => {
    return {
      offense: [
        {
          name: 'Quinn Ewers',
          position: 'QB',
          year: 'Jr.',
          height: '6-3',
          weight: '218',
          projectedStats: {
            passing: { yards: 3850, tds: 32, ints: 9, completion: 68.5 }
          },
          grade: 'A-',
          outlook: 'Elite arm talent with improved decision-making. Should lead one of the nation\'s top offenses.'
        },
        {
          name: 'Jaydon Blue',
          position: 'RB',
          year: 'So.',
          height: '5-11',
          weight: '200',
          projectedStats: {
            rushing: { yards: 1350, tds: 16, ypc: 5.8, carries: 233 }
          },
          grade: 'B+',
          outlook: 'Explosive runner with breakaway speed. Key to offensive balance and red zone success.'
        },
        {
          name: 'Isaiah Bond',
          position: 'WR',
          year: 'Jr.',
          height: '6-0',
          weight: '185',
          projectedStats: {
            receiving: { yards: 1200, tds: 14, receptions: 75, ypr: 16.0 }
          },
          grade: 'A',
          outlook: 'Transfer from Alabama brings elite route-running and big-play ability. Top target.'
        },
        {
          name: 'Gunnar Helm',
          position: 'TE',
          year: 'Sr.',
          height: '6-4',
          weight: '245',
          projectedStats: {
            receiving: { yards: 650, tds: 8, receptions: 45, ypr: 14.4 }
          },
          grade: 'B',
          outlook: 'Reliable target in the middle of the field. Strong blocker and red zone threat.'
        },
        {
          name: 'Kelvin Banks Jr.',
          position: 'LT',
          year: 'Jr.',
          height: '6-4',
          weight: '315',
          projectedStats: {},
          grade: 'A+',
          outlook: 'Potential first-round NFL pick. Anchors one of the nation\'s best offensive lines.'
        }
      ],
      defense: [
        {
          name: 'Anthony Hill Jr.',
          position: 'LB',
          year: 'So.',
          height: '6-2',
          weight: '235',
          projectedStats: {
            defense: { tackles: 125, sacks: 8.5, ints: 2, pbu: 8 }
          },
          grade: 'A',
          outlook: 'Elite athlete who can cover and rush the passer. Defensive centerpiece.'
        },
        {
          name: 'Barryn Sorrell',
          position: 'EDGE',
          year: 'Sr.',
          height: '6-3',
          weight: '255',
          projectedStats: {
            defense: { tackles: 65, sacks: 12.0, ints: 0, pbu: 3 }
          },
          grade: 'A-',
          outlook: 'Pass rush specialist with improved run defense. Key to defensive pressure.'
        },
        {
          name: 'Jahdae Barron',
          position: 'S',
          year: 'Jr.',
          height: '6-0',
          weight: '200',
          projectedStats: {
            defense: { tackles: 85, sacks: 1.0, ints: 6, pbu: 12 }
          },
          grade: 'B+',
          outlook: 'Ball-hawking safety with excellent instincts. Defensive backfield leader.'
        },
        {
          name: 'Malik Muhammad',
          position: 'CB',
          year: 'So.',
          height: '6-1',
          weight: '185',
          projectedStats: {
            defense: { tackles: 45, sacks: 0, ints: 4, pbu: 15 }
          },
          grade: 'B+',
          outlook: 'Lockdown corner with size and speed. Should see significant targets.'
        },
        {
          name: 'Vernon Broughton',
          position: 'DT',
          year: 'Sr.',
          height: '6-4',
          weight: '290',
          projectedStats: {
            defense: { tackles: 55, sacks: 4.5, ints: 0, pbu: 2 }
          },
          grade: 'B',
          outlook: 'Interior presence who can rush the passer. Veteran leadership up front.'
        }
      ],
      specialTeams: [
        {
          name: 'Bert Auburn',
          position: 'K',
          year: 'Jr.',
          height: '5-10',
          weight: '185',
          projectedStats: {},
          grade: 'B+',
          outlook: 'Reliable kicker with strong leg. Should handle all field goal and PAT duties.'
        },
        {
          name: 'Michael Kern',
          position: 'P',
          year: 'So.',
          height: '6-2',
          weight: '200',
          projectedStats: {},
          grade: 'B',
          outlook: 'Consistent punter with good hang time. Improved directional punting.'
        }
      ]
    };
  };

  const playerProjections = useMemo(() => {
    return generatePlayerProjections(selectedTeam);
  }, [selectedTeam]);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return theme.palette.success.main;
    if (grade.startsWith('B')) return theme.palette.info.main;
    if (grade.startsWith('C')) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const StatProjection: React.FC<{ label: string; value: number; suffix?: string }> = ({ 
    label, 
    value, 
    suffix = '' 
  }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
      <Typography variant="caption" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="caption" fontWeight="bold">
        {value.toLocaleString()}{suffix}
      </Typography>
    </Box>
  );

  const PlayerCard: React.FC<{ player: PlayerProjection }> = ({ player }) => (
    <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 50, 
              height: 50, 
              backgroundColor: teamData?.primaryColor,
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}
          >
            {player.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {player.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                label={player.position} 
                size="small" 
                color="primary" 
                sx={{ fontSize: '0.7rem' }}
              />
              <Typography variant="caption" color="text.secondary">
                {player.year} • {player.height} • {player.weight}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={player.grade}
            sx={{ 
              backgroundColor: getGradeColor(player.grade),
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Projected Stats */}
        {player.projectedStats.passing && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Passing Projections:
            </Typography>
            <StatProjection label="Yards" value={player.projectedStats.passing.yards} />
            <StatProjection label="TDs" value={player.projectedStats.passing.tds} />
            <StatProjection label="INTs" value={player.projectedStats.passing.ints} />
            <StatProjection label="Completion %" value={player.projectedStats.passing.completion} suffix="%" />
          </Box>
        )}

        {player.projectedStats.rushing && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Rushing Projections:
            </Typography>
            <StatProjection label="Yards" value={player.projectedStats.rushing.yards} />
            <StatProjection label="TDs" value={player.projectedStats.rushing.tds} />
            <StatProjection label="YPC" value={player.projectedStats.rushing.ypc} />
            <StatProjection label="Carries" value={player.projectedStats.rushing.carries} />
          </Box>
        )}

        {player.projectedStats.receiving && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Receiving Projections:
            </Typography>
            <StatProjection label="Yards" value={player.projectedStats.receiving.yards} />
            <StatProjection label="TDs" value={player.projectedStats.receiving.tds} />
            <StatProjection label="Receptions" value={player.projectedStats.receiving.receptions} />
            <StatProjection label="YPR" value={player.projectedStats.receiving.ypr} />
          </Box>
        )}

        {player.projectedStats.defense && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Defensive Projections:
            </Typography>
            <StatProjection label="Tackles" value={player.projectedStats.defense.tackles} />
            <StatProjection label="Sacks" value={player.projectedStats.defense.sacks} />
            <StatProjection label="INTs" value={player.projectedStats.defense.ints} />
            <StatProjection label="PBUs" value={player.projectedStats.defense.pbu} />
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Outlook:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            {player.outlook}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

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
          2025 Player Projections
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Detailed statistical projections and scouting reports for key players
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

      {/* Team Overview */}
      <Card sx={{ mb: 4, background: `linear-gradient(135deg, ${teamData?.primaryColor || '#8B0000'} 0%, ${alpha(teamData?.primaryColor || '#8B0000', 0.8)} 100%)` }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                {selectedTeam} {teamData?.mascot} - 2025 Roster Outlook
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Comprehensive player projections based on returning production, recruiting additions, 
                and coaching system fit. Grades reflect expected 2025 performance level.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Typography variant="h4" fontWeight="bold">
                  {playerProjections.offense.length + playerProjections.defense.length}
                </Typography>
                <Typography variant="body2">Key Players Projected</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs for Position Groups */}
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
          <Tab label="Offense" />
          <Tab label="Defense" />
          <Tab label="Special Teams" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {playerProjections.offense.map((player, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <PlayerCard player={player} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {playerProjections.defense.map((player, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <PlayerCard player={player} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {playerProjections.specialTeams.map((player, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <PlayerCard player={player} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Grading Legend */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Player Grading System
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="A+" sx={{ backgroundColor: theme.palette.success.main, color: 'white', fontWeight: 'bold' }} />
                <Typography variant="body2">Elite/All-American level talent</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="A/A-" sx={{ backgroundColor: theme.palette.success.main, color: 'white', fontWeight: 'bold' }} />
                <Typography variant="body2">All-Conference caliber player</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="B+/B" sx={{ backgroundColor: theme.palette.info.main, color: 'white', fontWeight: 'bold' }} />
                <Typography variant="body2">Above average starter</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="B-" sx={{ backgroundColor: theme.palette.info.main, color: 'white', fontWeight: 'bold' }} />
                <Typography variant="body2">Solid contributor</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="C+/C" sx={{ backgroundColor: theme.palette.warning.main, color: 'white', fontWeight: 'bold' }} />
                <Typography variant="body2">Average/Developing player</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="C-/D" sx={{ backgroundColor: theme.palette.error.main, color: 'white', fontWeight: 'bold' }} />
                <Typography variant="body2">Below average/Backup level</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PlayerProjections;
