import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Autocomplete,
  TextField,
  Button,
  Chip,
  Stack,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  useTheme,
  alpha,
  Switch,
  Alert
} from '@mui/material';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import {
  Build,
  Save,
  Refresh,
  TrendingUp,
  TrendingDown,
  Remove,
  AutoAwesome,
  EmojiEvents,
  Whatshot,
  Warning,
  CheckCircle,
  Lightbulb,
  Shuffle
} from '@mui/icons-material';
import { dummyTeamData } from '../../data/dummyData';

interface CustomMatchup {
  team1: any;
  team2: any;
  selectedMetrics: string[];
  weights: { [key: string]: number };
  conditions: {
    homeField: boolean;
    weather: string;
    rivalry: boolean;
    neutralSite: boolean;
    primeTime: boolean;
  };
  scenario?: string;
  name?: string;
}

interface PresetScenario {
  id: string;
  name: string;
  description: string;
  icon: any;
  metrics: string[];
  weights: { [key: string]: number };
  conditions: any;
  color: string;
}

interface SmartSuggestion {
  team1: any;
  team2: any;
  reason: string;
  type: 'trending' | 'rivalry' | 'upset' | 'championship';
  confidence: number;
}

const MatchupBuilder = () => {
  const theme = useTheme();
  
  const [matchup, setMatchup] = useState<CustomMatchup>({
    team1: null,
    team2: null,
    selectedMetrics: ['powerRating', 'appd', 'defensiveSuccessRate', 'turnoverMargin'],
    weights: {
      powerRating: 25,
      appd: 20,
      defensiveSuccessRate: 15,
      explosivePlayDiff: 10,
      thirdDownDiff: 10,
      turnoverMargin: 10,
      havocRate: 5,
      qbEpa: 5
    },
    conditions: {
      homeField: false,
      weather: 'clear',
      rivalry: false,
      neutralSite: false,
      primeTime: false
    }
  });

  const [advancedMode, setAdvancedMode] = useState(false);

  // Available metrics with descriptions
  const availableMetrics = [
    { id: 'powerRating', label: 'Power Rating', description: 'Overall team strength', category: 'Overall' },
    { id: 'appd', label: 'Adjusted PPD', description: 'Points per drive adjusted for competition', category: 'Offense' },
    { id: 'defensiveSuccessRate', label: 'Defensive Success Rate', description: 'Percentage of successful defensive plays', category: 'Defense' },
    { id: 'explosivePlayDiff', label: 'Explosive Play Diff', description: 'Difference in explosive plays created vs allowed', category: 'Big Plays' },
    { id: 'thirdDownDiff', label: 'Third Down Diff', description: 'Third down conversion rate differential', category: 'Situational' },
    { id: 'turnoverMargin', label: 'Turnover Margin', description: 'Average turnovers gained minus turnovers lost', category: 'Turnovers' },
    { id: 'lineYardsPerCarry', label: 'Line Yards/Carry', description: 'Rushing yards per carry at line of scrimmage', category: 'Rushing' },
    { id: 'havocRate', label: 'Havoc Rate', description: 'Rate of disruptive defensive plays', category: 'Defense' },
    { id: 'fieldPositionDiff', label: 'Field Position Diff', description: 'Average starting field position differential', category: 'Field Position' },
    { id: 'qbEpa', label: 'QB EPA', description: 'Quarterback Expected Points Added', category: 'Passing' },
    { id: 'redZoneTdPctDiff', label: 'Red Zone TD% Diff', description: 'Red zone touchdown percentage differential', category: 'Red Zone' }
  ];

  // Preset scenarios for quick matchup building
  const presetScenarios: PresetScenario[] = [
    {
      id: 'playoff',
      name: 'Playoff Matchup',
      description: 'High-stakes championship level analysis',
      icon: EmojiEvents,
      color: '#FFD700',
      metrics: ['powerRating', 'appd', 'defensiveSuccessRate', 'explosivePlayDiff', 'turnoverMargin', 'qbEpa'],
      weights: {
        powerRating: 30,
        appd: 25,
        defensiveSuccessRate: 20,
        explosivePlayDiff: 15,
        turnoverMargin: 5,
        qbEpa: 5
      },
      conditions: {
        homeField: false,
        weather: 'clear',
        rivalry: false,
        neutralSite: true,
        primeTime: true
      }
    },
    {
      id: 'rivalry',
      name: 'Rivalry Game',
      description: 'Emotion and history matter more',
      icon: Whatshot,
      color: '#FF4444',
      metrics: ['powerRating', 'turnoverMargin', 'thirdDownDiff', 'explosivePlayDiff', 'havocRate'],
      weights: {
        powerRating: 20,
        turnoverMargin: 25,
        thirdDownDiff: 20,
        explosivePlayDiff: 20,
        havocRate: 15
      },
      conditions: {
        homeField: true,
        weather: 'clear',
        rivalry: true,
        neutralSite: false,
        primeTime: false
      }
    },
    {
      id: 'upset_alert',
      name: 'Upset Special',
      description: 'Looking for underdog advantages',
      icon: Warning,
      color: '#FF9800',
      metrics: ['turnoverMargin', 'havocRate', 'explosivePlayDiff', 'thirdDownDiff', 'redZoneTdPctDiff'],
      weights: {
        turnoverMargin: 30,
        havocRate: 25,
        explosivePlayDiff: 20,
        thirdDownDiff: 15,
        redZoneTdPctDiff: 10
      },
      conditions: {
        homeField: true,
        weather: 'clear',
        rivalry: false,
        neutralSite: false,
        primeTime: false
      }
    },
    {
      id: 'balanced',
      name: 'Balanced Analysis',
      description: 'Equal weight across all factors',
      icon: CheckCircle,
      color: '#4CAF50',
      metrics: ['powerRating', 'appd', 'defensiveSuccessRate', 'explosivePlayDiff', 'thirdDownDiff', 'turnoverMargin', 'qbEpa'],
      weights: {
        powerRating: 15,
        appd: 15,
        defensiveSuccessRate: 15,
        explosivePlayDiff: 15,
        thirdDownDiff: 15,
        turnoverMargin: 15,
        qbEpa: 10
      },
      conditions: {
        homeField: false,
        weather: 'clear',
        rivalry: false,
        neutralSite: false,
        primeTime: false
      }
    }
  ];

  // State for additional features
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Generate smart matchup suggestions
  const smartSuggestions = useMemo((): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    
    // Rivalry suggestions
    const rivalryPairs = [
      { team1: 'Alabama', team2: 'Auburn', type: 'rivalry' as const },
      { team1: 'Michigan', team2: 'Ohio State', type: 'rivalry' as const },
      { team1: 'Texas', team2: 'Oklahoma', type: 'rivalry' as const },
      { team1: 'Florida', team2: 'Georgia', type: 'rivalry' as const }
    ];
    
    rivalryPairs.forEach(pair => {
      const team1Data = dummyTeamData.find(t => t.name === pair.team1);
      const team2Data = dummyTeamData.find(t => t.name === pair.team2);
      if (team1Data && team2Data) {
        suggestions.push({
          team1: team1Data,
          team2: team2Data,
          reason: `Classic ${pair.team1} vs ${pair.team2} rivalry`,
          type: pair.type,
          confidence: 95
        });
      }
    });

    // Upset potential suggestions
    const topTeams = dummyTeamData.filter(t => t.powerRating > 25).slice(0, 10);
    const midTierTeams = dummyTeamData.filter(t => t.powerRating >= 18 && t.powerRating <= 22);
    
    if (topTeams.length > 0 && midTierTeams.length > 0) {
      const randomTop = topTeams[Math.floor(Math.random() * topTeams.length)];
      const randomMid = midTierTeams[Math.floor(Math.random() * midTierTeams.length)];
      suggestions.push({
        team1: randomMid,
        team2: randomTop,
        reason: `Potential upset: ${randomMid.name} has strong defensive metrics`,
        type: 'upset',
        confidence: 75
      });
    }

    // Championship contenders
    const championship = topTeams.slice(0, 4);
    if (championship.length >= 2) {
      suggestions.push({
        team1: championship[0],
        team2: championship[1],
        reason: `Championship preview between top contenders`,
        type: 'championship',
        confidence: 90
      });
    }

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }, []);

  // Apply preset scenario
  const applyPreset = (scenario: PresetScenario) => {
    setMatchup(prev => ({
      ...prev,
      selectedMetrics: scenario.metrics,
      weights: scenario.weights,
      conditions: scenario.conditions,
      scenario: scenario.id
    }));
    setSelectedScenario(scenario.id);
  };

  // Apply smart suggestion
  const applySuggestion = (suggestion: SmartSuggestion) => {
    setMatchup(prev => ({
      ...prev,
      team1: suggestion.team1,
      team2: suggestion.team2
    }));
  };

  // Calculate matchup analysis
  const matchupAnalysis = useMemo(() => {
    if (!matchup.team1 || !matchup.team2) return null;

    const team1 = matchup.team1;
    const team2 = matchup.team2;

    // Calculate weighted scores
    let team1Score = 0;
    let team2Score = 0;
    let totalWeight = 0;

    const comparisons = matchup.selectedMetrics.map(metricId => {
      const metric = availableMetrics.find(m => m.id === metricId);
      const weight = matchup.weights[metricId] || 0;
      const team1Value = team1[metricId] || 0;
      const team2Value = team2[metricId] || 0;
      
      // Normalize values (simple approach - could be more sophisticated)
      const team1Normalized = Math.max(0, Math.min(100, (team1Value + 50) * 2));
      const team2Normalized = Math.max(0, Math.min(100, (team2Value + 50) * 2));
      
      team1Score += team1Normalized * (weight / 100);
      team2Score += team2Normalized * (weight / 100);
      totalWeight += weight;

      return {
        metric: metric?.label || metricId,
        team1Value,
        team2Value,
        team1Normalized,
        team2Normalized,
        weight,
        advantage: team1Value > team2Value ? 'team1' : team2Value > team1Value ? 'team2' : 'even'
      };
    });

    // Apply conditions
    if (matchup.conditions.homeField) {
      team1Score += 3; // Home field advantage
    }
    if (matchup.conditions.rivalry) {
      // Rivalry games tend to be closer
      const diff = Math.abs(team1Score - team2Score);
      team1Score = team1Score > team2Score ? team1Score - diff * 0.3 : team1Score + diff * 0.3;
      team2Score = team2Score > team1Score ? team2Score - diff * 0.3 : team2Score + diff * 0.3;
    }

    return {
      team1Score: team1Score / (totalWeight / 100),
      team2Score: team2Score / (totalWeight / 100),
      comparisons,
      prediction: team1Score > team2Score ? 'team1' : 'team2',
      confidence: Math.abs(team1Score - team2Score) / Math.max(team1Score, team2Score) * 100
    };
  }, [matchup, availableMetrics]);

  // Prepare radar chart data
  const radarData = useMemo(() => {
    if (!matchup.team1 || !matchup.team2) return [];

    return matchup.selectedMetrics.map(metricId => {
      const metric = availableMetrics.find(m => m.id === metricId);
      const team1Value = matchup.team1[metricId] || 0;
      const team2Value = matchup.team2[metricId] || 0;
      
      return {
        metric: metric?.label || metricId,
        team1: Math.max(0, Math.min(100, (team1Value + 50) * 2)),
        team2: Math.max(0, Math.min(100, (team2Value + 50) * 2))
      };
    });
  }, [matchup, availableMetrics]);

  const handleTeamSelect = (team: any, position: 'team1' | 'team2') => {
    setMatchup(prev => ({
      ...prev,
      [position]: team
    }));
  };

  const handleMetricToggle = (metricId: string) => {
    setMatchup(prev => ({
      ...prev,
      selectedMetrics: prev.selectedMetrics.includes(metricId)
        ? prev.selectedMetrics.filter(id => id !== metricId)
        : [...prev.selectedMetrics, metricId]
    }));
  };

  const handleWeightChange = (metricId: string, weight: number) => {
    setMatchup(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [metricId]: weight
      }
    }));
  };

  const saveMatchup = () => {
    if (matchup.team1 && matchup.team2) {
      // For now, just show an alert. In a real app, this would save to localStorage or backend
      alert(`Matchup saved: ${matchup.team1.name} vs ${matchup.team2.name}`);
    }
  };

  const resetMatchup = () => {
    setMatchup({
      team1: null,
      team2: null,
      selectedMetrics: ['powerRating', 'appd', 'defensiveSuccessRate', 'turnoverMargin'],
      weights: {
        powerRating: 25,
        appd: 20,
        defensiveSuccessRate: 15,
        explosivePlayDiff: 10,
        thirdDownDiff: 10,
        turnoverMargin: 10,
        havocRate: 5,
        qbEpa: 5
      },
      conditions: {
        homeField: false,
        weather: 'clear',
        rivalry: false,
        neutralSite: false,
        primeTime: false
      }
    });
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          <Build sx={{ mr: 2, verticalAlign: 'middle' }} />
          Matchup Builder
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Create custom team comparisons with weighted metrics and situational factors
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={advancedMode}
                onChange={(e) => setAdvancedMode(e.target.checked)}
              />
            }
            label="Advanced Mode"
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={resetMatchup}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveMatchup}
            disabled={!matchup.team1 || !matchup.team2}
          >
            Save Matchup
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Start - Preset Scenarios */}
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Lightbulb sx={{ mr: 1, color: 'primary.main' }} />
              Quick Start Templates
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose a preset scenario to quickly configure your matchup analysis
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {presetScenarios.map((scenario) => {
                const IconComponent = scenario.icon;
                const isSelected = selectedScenario === scenario.id;
                
                return (
                  <Card 
                    key={scenario.id}
                    sx={{ 
                      cursor: 'pointer',
                      minWidth: 200,
                      flex: '1 1 calc(25% - 12px)',
                      border: isSelected ? `2px solid ${scenario.color}` : '1px solid transparent',
                      bgcolor: isSelected ? alpha(scenario.color, 0.08) : 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                        border: `2px solid ${scenario.color}`
                      }
                    }}
                    onClick={() => applyPreset(scenario)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <IconComponent 
                        sx={{ 
                          fontSize: 40, 
                          color: scenario.color, 
                          mb: 1 
                        }} 
                      />
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {scenario.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {scenario.description}
                      </Typography>
                      {isSelected && (
                        <Chip 
                          label="Active" 
                          size="small" 
                          sx={{ 
                            mt: 1, 
                            bgcolor: scenario.color, 
                            color: 'white' 
                          }} 
                        />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Paper>
        </Box>

        {/* Smart Suggestions */}
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                <AutoAwesome sx={{ mr: 1, color: 'secondary.main' }} />
                Smart Suggestions
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Shuffle />}
                onClick={() => window.location.reload()}
              >
                New Suggestions
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Trending matchups and interesting comparisons based on current data
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {smartSuggestions.slice(0, 3).map((suggestion, index) => {
                const getTypeIcon = (type: string) => {
                  switch (type) {
                    case 'rivalry': return <Whatshot sx={{ color: '#FF4444' }} />;
                    case 'upset': return <Warning sx={{ color: '#FF9800' }} />;
                    case 'championship': return <EmojiEvents sx={{ color: '#FFD700' }} />;
                    default: return <TrendingUp sx={{ color: 'primary.main' }} />;
                  }
                };
                
                return (
                  <Card 
                    key={index}
                    sx={{
                      cursor: 'pointer',
                      flex: '1 1 calc(33.33% - 12px)',
                      minWidth: 280,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getTypeIcon(suggestion.type)}
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {suggestion.type.toUpperCase()}
                        </Typography>
                        <Chip 
                          label={`${suggestion.confidence}%`} 
                          size="small" 
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                      
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {suggestion.team1.name} vs {suggestion.team2.name}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {suggestion.reason}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {suggestion.team1.conference} vs {suggestion.team2.conference}
                        </Typography>
                        <Button size="small" variant="text">
                          Analyze →
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Paper>
        </Box>

        {/* Team Selection */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Select Teams
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={dummyTeamData}
                  getOptionLabel={(option) => `${option.name} (${option.wins}-${option.losses})`}
                  value={matchup.team1}
                  onChange={(_, value) => handleTeamSelect(value, 'team1')}
                  renderInput={(params) => (
                    <TextField {...params} label="Team 1" fullWidth />
                  )}
                />
                {matchup.team1 && (
                  <Card sx={{ mt: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <CardContent>
                      <Typography variant="h6">{matchup.team1.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {matchup.team1.conference} • {matchup.team1.wins}-{matchup.team1.losses}
                      </Typography>
                      <Typography variant="body2">
                        Power Rating: {matchup.team1.powerRating?.toFixed(1)}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={dummyTeamData}
                  getOptionLabel={(option) => `${option.name} (${option.wins}-${option.losses})`}
                  value={matchup.team2}
                  onChange={(_, value) => handleTeamSelect(value, 'team2')}
                  renderInput={(params) => (
                    <TextField {...params} label="Team 2" fullWidth />
                  )}
                />
                {matchup.team2 && (
                  <Card sx={{ mt: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                    <CardContent>
                      <Typography variant="h6">{matchup.team2.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {matchup.team2.conference} • {matchup.team2.wins}-{matchup.team2.losses}
                      </Typography>
                      <Typography variant="body2">
                        Power Rating: {matchup.team2.powerRating?.toFixed(1)}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Metric Selection */}
        <Grid item xs={12} md={advancedMode ? 6 : 12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Select Metrics
            </Typography>
            <FormGroup>
              {availableMetrics.map(metric => (
                <FormControlLabel
                  key={metric.id}
                  control={
                    <Checkbox
                      checked={matchup.selectedMetrics.includes(metric.id)}
                      onChange={() => handleMetricToggle(metric.id)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {metric.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {metric.description}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        {/* Advanced Controls */}
        {advancedMode && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Metric Weights
              </Typography>
              <Stack spacing={2}>
                {matchup.selectedMetrics.map(metricId => {
                  const metric = availableMetrics.find(m => m.id === metricId);
                  return (
                    <Box key={metricId}>
                      <Typography variant="body2" gutterBottom>
                        {metric?.label} ({matchup.weights[metricId] || 0}%)
                      </Typography>
                      <Slider
                        value={matchup.weights[metricId] || 0}
                        onChange={(_, value) => handleWeightChange(metricId, value as number)}
                        min={0}
                        max={50}
                        step={5}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  );
                })}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Situational Factors
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={matchup.conditions.homeField}
                      onChange={(e) => setMatchup(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, homeField: e.target.checked }
                      }))}
                    />
                  }
                  label="Home Field Advantage (Team 1)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={matchup.conditions.rivalry}
                      onChange={(e) => setMatchup(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, rivalry: e.target.checked }
                      }))}
                    />
                  }
                  label="Rivalry Game"
                />
              </FormGroup>
            </Paper>
          </Grid>
        )}

        {/* Analysis Results */}
        {matchup.team1 && matchup.team2 && matchupAnalysis && (
          <>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Matchup Analysis
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ 
                      bgcolor: matchupAnalysis.prediction === 'team1' 
                        ? alpha(theme.palette.success.main, 0.1) 
                        : alpha(theme.palette.error.main, 0.1),
                      border: matchupAnalysis.prediction === 'team1' ? `2px solid ${theme.palette.success.main}` : 'none'
                    }}>
                      <CardContent>
                        <Typography variant="h6">{matchup.team1.name}</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                          {matchupAnalysis.team1Score.toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Composite Score
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ 
                      bgcolor: matchupAnalysis.prediction === 'team2' 
                        ? alpha(theme.palette.success.main, 0.1) 
                        : alpha(theme.palette.error.main, 0.1),
                      border: matchupAnalysis.prediction === 'team2' ? `2px solid ${theme.palette.success.main}` : 'none'
                    }}>
                      <CardContent>
                        <Typography variant="h6">{matchup.team2.name}</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                          {matchupAnalysis.team2Score.toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Composite Score
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Alert 
                  severity={matchupAnalysis.confidence > 70 ? 'success' : matchupAnalysis.confidence > 40 ? 'warning' : 'info'}
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    <strong>Prediction:</strong> {matchupAnalysis.prediction === 'team1' ? matchup.team1.name : matchup.team2.name} favored
                    <br />
                    <strong>Confidence:</strong> {matchupAnalysis.confidence.toFixed(1)}%
                  </Typography>
                </Alert>
              </Paper>
            </Grid>

            {/* Radar Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Metric Comparison
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name={matchup.team1.name}
                      dataKey="team1"
                      stroke={theme.palette.primary.main}
                      fill={theme.palette.primary.main}
                      fillOpacity={0.3}
                    />
                    <Radar
                      name={matchup.team2.name}
                      dataKey="team2"
                      stroke={theme.palette.secondary.main}
                      fill={theme.palette.secondary.main}
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Detailed Comparison */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Detailed Breakdown
                </Typography>
                <Stack spacing={2}>
                  {matchupAnalysis.comparisons.map((comp, index) => (
                    <Box key={index}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {comp.metric}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${comp.weight}%`}
                          color="default"
                          variant="outlined"
                        />
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ minWidth: 60 }}>
                          {comp.team1Value.toFixed(2)}
                        </Typography>
                        {comp.advantage === 'team1' ? (
                          <TrendingUp color="success" />
                        ) : comp.advantage === 'team2' ? (
                          <TrendingDown color="error" />
                        ) : (
                          <Remove color="disabled" />
                        )}
                        <Typography variant="body2" sx={{ minWidth: 60 }}>
                          {comp.team2Value.toFixed(2)}
                        </Typography>
                      </Stack>
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default MatchupBuilder;
