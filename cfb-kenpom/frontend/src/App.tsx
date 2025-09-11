import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  useMediaQuery
} from '@mui/material';
import type { PaletteMode } from '@mui/material';
import './App.css';

// Components
import Header from './components/Header/Header';
import TeamRatings from './components/TeamRatings/TeamRatings';
import TeamDetail from './components/TeamDetail/TeamDetail';
import GameComparison from './components/GameComparison/GameComparison';
import Methodology from './components/Methodology/Methodology';
import Predictions from './components/Predictions/Predictions';
import AnalyticsDashboard from './components/AnalyticsDashboard/AnalyticsDashboard';
import MatchupBuilder from './components/MatchupBuilder/MatchupBuilder';
import StatisticalExplorer from './components/StatisticalExplorer/StatisticalExplorer';
import HeismanRace from './components/HeismanRace/HeismanRace';
import ConferenceDashboard from './components/ConferenceDashboard/ConferenceDashboard';
import TeamSchedule from './components/TeamSchedule/TeamSchedule';
import ConferencePredictions from './components/ConferencePredictions/ConferencePredictions';
import PlayerProjections from './components/PlayerProjections/PlayerProjections';

// Color palette definition
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#90caf9' : '#1565c0',
      light: mode === 'dark' ? '#e3f2fd' : '#42a5f5',
      dark: mode === 'dark' ? '#42a5f5' : '#0d47a1',
    },
    secondary: {
      main: mode === 'dark' ? '#f48fb1' : '#c2185b',
      light: mode === 'dark' ? '#f8bbd0' : '#f06292',
      dark: mode === 'dark' ? '#c2185b' : '#880e4f',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f5f5',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#212121',
      secondary: mode === 'dark' ? '#b0bec5' : '#757575',
    },
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none' as const,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'dark' 
            ? '0 8px 16px rgba(0, 0, 0, 0.4)' 
            : '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  // Use system preference for initial theme mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode>(prefersDarkMode ? 'dark' : 'light');

  // Update theme when system preference changes
  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  // Create theme based on current mode
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  // Toggle theme mode
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          color: 'text.primary',
          transition: 'all 0.3s ease'
        }}>
          <Header toggleColorMode={toggleColorMode} mode={mode} />
          <Box component="main" sx={{ flex: 1, p: { xs: 1, sm: 2, md: 3 } }}>
            <Routes>
              <Route path="/" element={<TeamRatings />} />
              <Route path="/team/:id" element={<TeamDetail />} />
              <Route path="/game/:gameId" element={<GameComparison />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/matchup-builder" element={<MatchupBuilder />} />
              <Route path="/statistical-explorer" element={<StatisticalExplorer />} />
              <Route path="/heisman-race" element={<HeismanRace />} />
              <Route path="/conference-dashboard" element={<ConferenceDashboard />} />
              <Route path="/team-schedule" element={<TeamSchedule />} />
              <Route path="/conference-predictions" element={<ConferencePredictions />} />
              <Route path="/player-projections" element={<PlayerProjections />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
