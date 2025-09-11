import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  Explore,
  FilterList,
  TrendingUp,
  Analytics,
  Download,
  Share,
  ExpandMore,
  Insights,
  Calculate,
  Timeline
} from '@mui/icons-material';
import { dummyTeamData } from '../../data/dummyData';

interface FilterCriteria {
  conferences: string[];
  recordRange: [number, number];
  powerRatingRange: [number, number];
  customFilters: { [key: string]: [number, number] };
}

interface StatisticalInsight {
  title: string;
  description: string;
  teams: any[];
  significance: 'high' | 'medium' | 'low';
  category: string;
}

const StatisticalExplorer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [selectedMetricX, setSelectedMetricX] = useState('powerRating');
  const [selectedMetricY, setSelectedMetricY] = useState('appd');
  const [chartType, setChartType] = useState('scatter');
  const [showTrendLine, setShowTrendLine] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>({
    conferences: [],
    recordRange: [0, 15],
    powerRatingRange: [-30, 30],
    customFilters: {}
  });
  const [insightDialogOpen, setInsightDialogOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<StatisticalInsight | null>(null);

  // Available metrics for analysis
  const metrics = [
    { id: 'powerRating', label: 'Power Rating', min: -30, max: 30, format: 'decimal' },
    { id: 'appd', label: 'Adjusted PPD', min: -5, max: 5, format: 'decimal' },
    { id: 'defensiveSuccessRate', label: 'Defensive Success Rate', min: 0, max: 100, format: 'percent' },
    { id: 'explosivePlayDiff', label: 'Explosive Play Diff', min: -10, max: 10, format: 'decimal' },
    { id: 'thirdDownDiff', label: 'Third Down Diff', min: -0.5, max: 0.5, format: 'percent' },
    { id: 'turnoverMargin', label: 'Turnover Margin', min: -3, max: 3, format: 'decimal' },
    { id: 'lineYardsPerCarry', label: 'Line Yards/Carry', min: 2, max: 6, format: 'decimal' },
    { id: 'havocRate', label: 'Havoc Rate', min: 0, max: 30, format: 'percent' },
    { id: 'fieldPositionDiff', label: 'Field Position Diff', min: -10, max: 10, format: 'decimal' },
    { id: 'qbEpa', label: 'QB EPA', min: -0.5, max: 0.5, format: 'decimal' },
    { id: 'redZoneTdPctDiff', label: 'Red Zone TD% Diff', min: -0.5, max: 0.5, format: 'percent' },
    { id: 'wins', label: 'Wins', min: 0, max: 15, format: 'integer' },
    { id: 'losses', label: 'Losses', min: 0, max: 15, format: 'integer' }
  ];

  // Get unique conferences
  const conferences = useMemo(() => {
    return [...new Set(dummyTeamData.map(team => team.conference))].sort();
  }, []);

  // Apply filters to data
  const filteredData = useMemo(() => {
    let data = dummyTeamData;

    // Conference filter
    if (filters.conferences.length > 0) {
      data = data.filter(team => filters.conferences.includes(team.conference));
    }

    // Record filter
    data = data.filter(team => {
      const totalGames = team.wins + team.losses;
      return totalGames >= filters.recordRange[0] && totalGames <= filters.recordRange[1];
    });

    // Power rating filter
    data = data.filter(team => 
      team.powerRating >= filters.powerRatingRange[0] && 
      team.powerRating <= filters.powerRatingRange[1]
    );

    // Custom metric filters
    Object.entries(filters.customFilters).forEach(([metricId, range]) => {
      data = data.filter(team => {
        const value = team[metricId as keyof typeof team] as number;
        return value >= range[0] && value <= range[1];
      });
    });

    return data;
  }, [filters]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return filteredData.map(team => ({
      name: team.name,
      x: team[selectedMetricX as keyof typeof team] as number,
      y: team[selectedMetricY as keyof typeof team] as number,
      conference: team.conference,
      wins: team.wins,
      losses: team.losses,
      powerRating: team.powerRating
    }));
  }, [filteredData, selectedMetricX, selectedMetricY]);

  // Generate statistical insights
  const statisticalInsights = useMemo(() => {
    const insights: StatisticalInsight[] = [];

    // Find outliers
    const xMetric = metrics.find(m => m.id === selectedMetricX);
    const yMetric = metrics.find(m => m.id === selectedMetricY);
    
    if (xMetric && yMetric) {
      const xValues = chartData.map(d => d.x);
      const yValues = chartData.map(d => d.y);
      
      const xMean = xValues.reduce((sum, val) => sum + val, 0) / xValues.length;
      const yMean = yValues.reduce((sum, val) => sum + val, 0) / yValues.length;
      
      const xStd = Math.sqrt(xValues.reduce((sum, val) => sum + Math.pow(val - xMean, 2), 0) / xValues.length);
      const yStd = Math.sqrt(yValues.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0) / yValues.length);

      // Find teams that are outliers in both metrics
      const outliers = chartData.filter(team => 
        Math.abs(team.x - xMean) > 2 * xStd && Math.abs(team.y - yMean) > 2 * yStd
      );

      if (outliers.length > 0) {
        insights.push({
          title: 'Statistical Outliers',
          description: `Teams that significantly deviate from the norm in both ${xMetric.label} and ${yMetric.label}`,
          teams: outliers.map(o => filteredData.find(t => t.name === o.name)!),
          significance: 'high',
          category: 'Outliers'
        });
      }

      // Find high-performing teams with surprising metrics
      const surprisingPerformers = chartData.filter(team => {
        const expectedWins = Math.max(0, Math.min(15, (team.powerRating + 10) * 0.4));
        const actualWins = team.wins;
        return Math.abs(actualWins - expectedWins) > 3;
      });

      if (surprisingPerformers.length > 0) {
        insights.push({
          title: 'Surprising Performers',
          description: 'Teams whose win-loss record significantly differs from their power rating',
          teams: surprisingPerformers.map(s => filteredData.find(t => t.name === s.name)!),
          significance: 'medium',
          category: 'Performance'
        });
      }

      // Conference analysis
      const conferenceStats = conferences.map(conf => {
        const confTeams = chartData.filter(team => team.conference === conf);
        if (confTeams.length === 0) return null;
        
        const avgX = confTeams.reduce((sum, team) => sum + team.x, 0) / confTeams.length;
        const avgY = confTeams.reduce((sum, team) => sum + team.y, 0) / confTeams.length;
        
        return { conference: conf, avgX, avgY, count: confTeams.length };
      }).filter(Boolean);

      const topConference = conferenceStats.reduce((best, current) => 
        !best || (current!.avgX + current!.avgY) > (best.avgX + best.avgY) ? current : best
      );

      if (topConference) {
        insights.push({
          title: `${topConference.conference} Conference Dominance`,
          description: `Leads in combined ${xMetric.label} and ${yMetric.label} metrics`,
          teams: filteredData.filter(t => t.conference === topConference.conference),
          significance: 'medium',
          category: 'Conference'
        });
      }
    }

    return insights;
  }, [chartData, selectedMetricX, selectedMetricY, metrics, conferences, filteredData]);

  // Calculate correlation
  const correlation = useMemo(() => {
    if (chartData.length < 2) return 0;
    
    const xValues = chartData.map(d => d.x);
    const yValues = chartData.map(d => d.y);
    
    const n = xValues.length;
    const sumX = xValues.reduce((sum, val) => sum + val, 0);
    const sumY = yValues.reduce((sum, val) => sum + val, 0);
    const sumXY = xValues.reduce((sum, val, i) => sum + val * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = yValues.reduce((sum, val) => sum + val * val, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return isNaN(correlation) ? 0 : correlation;
  }, [chartData]);

  const handleConferenceFilter = (conference: string) => {
    setFilters(prev => ({
      ...prev,
      conferences: prev.conferences.includes(conference)
        ? prev.conferences.filter(c => c !== conference)
        : [...prev.conferences, conference]
    }));
  };

  const handleCustomFilter = (metricId: string, range: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      customFilters: {
        ...prev.customFilters,
        [metricId]: range
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      conferences: [],
      recordRange: [0, 15],
      powerRatingRange: [-30, 30],
      customFilters: {}
    });
  };

  const exportData = () => {
    const csvContent = [
      ['Team', 'Conference', 'Wins', 'Losses', selectedMetricX, selectedMetricY],
      ...chartData.map(team => [
        team.name,
        team.conference,
        team.wins,
        team.losses,
        team.x,
        team.y
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statistical-analysis-${selectedMetricX}-vs-${selectedMetricY}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          <Explore sx={{ mr: 2, verticalAlign: 'middle' }} />
          Statistical Explorer
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Deep-dive into team statistics with advanced filtering and correlation analysis
        </Typography>
        
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip 
            label={`${filteredData.length} teams`} 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={`Correlation: ${(correlation * 100).toFixed(1)}%`} 
            color={Math.abs(correlation) > 0.5 ? 'success' : Math.abs(correlation) > 0.3 ? 'warning' : 'default'}
          />
          {statisticalInsights.length > 0 && (
            <Chip 
              label={`${statisticalInsights.length} insights`} 
              color="info" 
              onClick={() => setInsightDialogOpen(true)}
              clickable
            />
          )}
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Analysis Controls
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>X-Axis Metric</InputLabel>
                  <Select
                    value={selectedMetricX}
                    label="X-Axis Metric"
                    onChange={(e) => setSelectedMetricX(e.target.value)}
                  >
                    {metrics.map(metric => (
                      <MenuItem key={metric.id} value={metric.id}>
                        {metric.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Y-Axis Metric</InputLabel>
                  <Select
                    value={selectedMetricY}
                    label="Y-Axis Metric"
                    onChange={(e) => setSelectedMetricY(e.target.value)}
                  >
                    {metrics.map(metric => (
                      <MenuItem key={metric.id} value={metric.id}>
                        {metric.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Chart Type</InputLabel>
                  <Select
                    value={chartType}
                    label="Chart Type"
                    onChange={(e) => setChartType(e.target.value)}
                  >
                    <MenuItem value="scatter">Scatter Plot</MenuItem>
                    <MenuItem value="bar">Bar Chart</MenuItem>
                    <MenuItem value="line">Line Chart</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={exportData}
                    size="small"
                  >
                    Export
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={clearFilters}
                    size="small"
                  >
                    Clear Filters
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Filters */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
              Filters
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Conferences</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup>
                  {conferences.map(conf => (
                    <FormControlLabel
                      key={conf}
                      control={
                        <Checkbox
                          checked={filters.conferences.includes(conf)}
                          onChange={() => handleConferenceFilter(conf)}
                        />
                      }
                      label={conf}
                    />
                  ))}
                </FormGroup>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Record Range</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" gutterBottom>
                  Total Games: {filters.recordRange[0]} - {filters.recordRange[1]}
                </Typography>
                <Slider
                  value={filters.recordRange}
                  onChange={(_, value) => setFilters(prev => ({ ...prev, recordRange: value as [number, number] }))}
                  min={0}
                  max={15}
                  valueLabelDisplay="auto"
                  marks
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Power Rating Range</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" gutterBottom>
                  Range: {filters.powerRatingRange[0]} - {filters.powerRatingRange[1]}
                </Typography>
                <Slider
                  value={filters.powerRatingRange}
                  onChange={(_, value) => setFilters(prev => ({ ...prev, powerRatingRange: value as [number, number] }))}
                  min={-30}
                  max={30}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: -30, label: '-30' },
                    { value: 0, label: '0' },
                    { value: 30, label: '30' }
                  ]}
                />
              </AccordionDetails>
            </Accordion>

            {/* Custom Metric Filters */}
            {metrics.filter(m => m.id !== selectedMetricX && m.id !== selectedMetricY).slice(0, 3).map(metric => (
              <Accordion key={metric.id}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>{metric.label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" gutterBottom>
                    Range: {filters.customFilters[metric.id]?.[0] ?? metric.min} - {filters.customFilters[metric.id]?.[1] ?? metric.max}
                  </Typography>
                  <Slider
                    value={filters.customFilters[metric.id] || [metric.min, metric.max]}
                    onChange={(_, value) => handleCustomFilter(metric.id, value as [number, number])}
                    min={metric.min}
                    max={metric.max}
                    step={(metric.max - metric.min) / 100}
                    valueLabelDisplay="auto"
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {metrics.find(m => m.id === selectedMetricY)?.label} vs {metrics.find(m => m.id === selectedMetricX)?.label}
            </Typography>
            
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'scatter' ? (
                <ScatterChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    name={metrics.find(m => m.id === selectedMetricX)?.label}
                    type="number"
                  />
                  <YAxis 
                    dataKey="y" 
                    name={metrics.find(m => m.id === selectedMetricY)?.label}
                    type="number"
                  />
                  <RechartsTooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle2">{data.name}</Typography>
                            <Typography variant="body2">
                              {metrics.find(m => m.id === selectedMetricX)?.label}: {data.x?.toFixed(2)}
                            </Typography>
                            <Typography variant="body2">
                              {metrics.find(m => m.id === selectedMetricY)?.label}: {data.y?.toFixed(2)}
                            </Typography>
                            <Typography variant="body2">Record: {data.wins}-{data.losses}</Typography>
                            <Typography variant="body2">Conference: {data.conference}</Typography>
                          </Paper>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="y" fill={theme.palette.primary.main} />
                </ScatterChart>
              ) : chartType === 'bar' ? (
                <BarChart data={chartData.slice(0, 20)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="y" fill={theme.palette.primary.main} />
                </BarChart>
              ) : (
                <LineChart data={chartData.sort((a, b) => a.x - b.x)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Correlation coefficient: {(correlation * 100).toFixed(1)}%
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Insights />}
                onClick={() => setInsightDialogOpen(true)}
                disabled={statisticalInsights.length === 0}
              >
                View Insights ({statisticalInsights.length})
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Data Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Filtered Data ({filteredData.length} teams)
            </Typography>
            
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Team</TableCell>
                    <TableCell>Conference</TableCell>
                    <TableCell>Record</TableCell>
                    <TableCell align="right">
                      {metrics.find(m => m.id === selectedMetricX)?.label}
                    </TableCell>
                    <TableCell align="right">
                      {metrics.find(m => m.id === selectedMetricY)?.label}
                    </TableCell>
                    <TableCell align="right">Power Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chartData.slice(0, 50).map((team, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{team.name}</TableCell>
                      <TableCell>{team.conference}</TableCell>
                      <TableCell>{team.wins}-{team.losses}</TableCell>
                      <TableCell align="right">{team.x.toFixed(2)}</TableCell>
                      <TableCell align="right">{team.y.toFixed(2)}</TableCell>
                      <TableCell align="right">{team.powerRating.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Insights Dialog */}
      <Dialog 
        open={insightDialogOpen} 
        onClose={() => setInsightDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Insights sx={{ mr: 1, verticalAlign: 'middle' }} />
          Statistical Insights
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {statisticalInsights.map((insight, index) => (
              <Card key={index}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {insight.description}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Teams:</strong> {insight.teams.map(t => t.name).join(', ')}
                      </Typography>
                    </Box>
                    <Chip 
                      label={insight.significance} 
                      color={insight.significance === 'high' ? 'error' : insight.significance === 'medium' ? 'warning' : 'default'}
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInsightDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StatisticalExplorer;
