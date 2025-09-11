import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Stack,
  Divider,
  useTheme,
  alpha,
  IconButton,
  Tooltip
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
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Analytics,
  Compare,
  FilterList,
  Insights,
  Timeline,
  ScatterPlot,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AnalyticsDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState('powerRating');
  const [selectedConference, setSelectedConference] = useState('all');
  const [chartType, setChartType] = useState('scatter');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Available metrics for analysis
  const metrics = [
    { id: 'powerRating', label: 'Power Rating', description: 'Overall team strength' },
    { id: 'appd', label: 'Adjusted PPD', description: 'Points per drive adjusted for competition' },
    { id: 'defensiveSuccessRate', label: 'Defensive Success Rate', description: 'Percentage of successful defensive plays' },
    { id: 'explosivePlayDiff', label: 'Explosive Play Differential', description: 'Difference in explosive plays created vs allowed' },
    { id: 'thirdDownDiff', label: 'Third Down Differential', description: 'Third down conversion rate differential' },
    { id: 'turnoverMargin', label: 'Turnover Margin', description: 'Average turnovers gained minus turnovers lost' },
    { id: 'havocRate', label: 'Havoc Rate', description: 'Rate of disruptive defensive plays' },
    { id: 'qbEpa', label: 'QB EPA', description: 'Quarterback Expected Points Added' }
  ];

  // Get unique conferences
  const conferences = useMemo(() => {
    const confs = [...new Set(dummyTeamData.map(team => team.conference))];
    return confs.sort();
  }, []);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let data = dummyTeamData;
    if (selectedConference !== 'all') {
      data = data.filter(team => team.conference === selectedConference);
    }
    return data;
  }, [selectedConference]);

  // Prepare scatter plot data
  const scatterData = useMemo(() => {
    return filteredData.map(team => ({
      name: team.name,
      x: team[selectedMetric as keyof typeof team] as number,
      y: team.powerRating,
      conference: team.conference,
      wins: team.wins,
      losses: team.losses
    }));
  }, [filteredData, selectedMetric]);

  // Prepare correlation analysis
  const correlationData = useMemo(() => {
    const correlations = metrics.map(metric => {
      const values = filteredData.map(team => ({
        x: team[metric.id as keyof typeof team] as number,
        y: team.powerRating
      }));
      
      // Simple correlation calculation
      const n = values.length;
      const sumX = values.reduce((sum, val) => sum + val.x, 0);
      const sumY = values.reduce((sum, val) => sum + val.y, 0);
      const sumXY = values.reduce((sum, val) => sum + val.x * val.y, 0);
      const sumX2 = values.reduce((sum, val) => sum + val.x * val.x, 0);
      const sumY2 = values.reduce((sum, val) => sum + val.y * val.y, 0);
      
      const correlation = (n * sumXY - sumX * sumY) / 
        Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      
      return {
        metric: metric.label,
        correlation: isNaN(correlation) ? 0 : correlation,
        strength: Math.abs(correlation || 0)
      };
    }).sort((a, b) => b.strength - a.strength);
    
    return correlations;
  }, [filteredData, metrics]);

  // Conference distribution data
  const conferenceData = useMemo(() => {
    const distribution = conferences.map(conf => ({
      name: conf,
      count: dummyTeamData.filter(team => team.conference === conf).length,
      avgRating: dummyTeamData
        .filter(team => team.conference === conf)
        .reduce((sum, team) => sum + team.powerRating, 0) / 
        dummyTeamData.filter(team => team.conference === conf).length
    }));
    return distribution;
  }, [conferences]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          <Analytics sx={{ mr: 2, verticalAlign: 'middle' }} />
          Analytics Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Explore team statistics, discover correlations, and build your own insights
        </Typography>
        
        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <CardContent>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                  {dummyTeamData.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Teams Analyzed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
              <CardContent>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  {conferences.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Conferences
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
              <CardContent>
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                  {metrics.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Key Metrics
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
              <CardContent>
                <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                  {Math.round(correlationData[0]?.strength * 100 || 0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Top Correlation
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Metric to Analyze</InputLabel>
            <Select
              value={selectedMetric}
              label="Metric to Analyze"
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {metrics.map(metric => (
                <MenuItem key={metric.id} value={metric.id}>
                  {metric.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Conference</InputLabel>
            <Select
              value={selectedConference}
              label="Conference"
              onChange={(e) => setSelectedConference(e.target.value)}
            >
              <MenuItem value="all">All Conferences</MenuItem>
              {conferences.map(conf => (
                <MenuItem key={conf} value={conf}>{conf}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={chartType}
              label="Chart Type"
              onChange={(e) => setChartType(e.target.value)}
            >
              <MenuItem value="scatter">Scatter Plot</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="line">Trend Line</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<Compare />}
            onClick={() => navigate('/matchup-builder')}
            sx={{ ml: 'auto' }}
          >
            Build Custom Matchup
          </Button>
        </Stack>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="analytics tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<ScatterPlot />} label="Metric Analysis" />
          <Tab icon={<Insights />} label="Correlations" />
          <Tab icon={<PieChartIcon />} label="Conference Breakdown" />
          <Tab icon={<Timeline />} label="Trends" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {metrics.find(m => m.id === selectedMetric)?.label} Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {metrics.find(m => m.id === selectedMetric)?.description}
            </Typography>
            
            {selectedConference !== 'all' && (
              <Chip 
                label={`Filtered: ${selectedConference}`} 
                color="primary" 
                sx={{ mb: 2 }}
                onDelete={() => setSelectedConference('all')}
              />
            )}
          </Box>

          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'scatter' ? (
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="x" 
                  name={metrics.find(m => m.id === selectedMetric)?.label}
                  type="number"
                />
                <YAxis dataKey="y" name="Power Rating" type="number" />
                <RechartsTooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle2">{data.name}</Typography>
                          <Typography variant="body2">
                            {metrics.find(m => m.id === selectedMetric)?.label}: {data.x?.toFixed(2)}
                          </Typography>
                          <Typography variant="body2">Power Rating: {data.y?.toFixed(2)}</Typography>
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
              <BarChart data={filteredData.slice(0, 20)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey={selectedMetric} fill={theme.palette.primary.main} />
              </BarChart>
            ) : (
              <LineChart data={filteredData.sort((a, b) => a[selectedMetric as keyof typeof a] as number - (b[selectedMetric as keyof typeof b] as number))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h5" gutterBottom>
            Correlation Analysis with Power Rating
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Discover which metrics have the strongest relationship with overall team strength
          </Typography>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[-1, 1]} />
              <RechartsTooltip 
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Correlation']}
              />
              <Bar 
                dataKey="correlation" 
                fill={(entry) => entry > 0 ? theme.palette.success.main : theme.palette.error.main}
              >
                {correlationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.correlation > 0 ? theme.palette.success.main : theme.palette.error.main} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Key Insights:</Typography>
            <Stack spacing={1}>
              {correlationData.slice(0, 3).map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.metric}: ${(item.correlation * 100).toFixed(1)}% correlation`}
                  color={item.correlation > 0.5 ? 'success' : item.correlation > 0.3 ? 'warning' : 'default'}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h5" gutterBottom>
            Conference Analysis
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Team Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={conferenceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, count }) => `${name}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {conferenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Average Power Rating by Conference</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conferenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="avgRating" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Typography variant="h5" gutterBottom>
            Performance Trends
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Historical performance patterns and seasonal trends
          </Typography>
          
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Timeline sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Trend Analysis Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Historical data integration in development
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AnalyticsDashboard;
