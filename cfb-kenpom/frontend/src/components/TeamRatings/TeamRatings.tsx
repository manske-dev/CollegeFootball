import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  Box,
  TableSortLabel,
  LinearProgress,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
  Button,
  Container,
  Fade,
  Zoom,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Stack
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Link } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StadiumIcon from '@mui/icons-material/Stadium';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CompareIcon from '@mui/icons-material/Compare';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { dummyTeamData } from '../../data/dummyData';
import { useNavigate } from 'react-router-dom';

type Order = 'asc' | 'desc';
type TeamRating = typeof dummyTeamData[0];
type SortableKey = keyof TeamRating;

const TeamRatings: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<string>('powerRating');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConference, setFilterConference] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  
  // Extract unique conferences for filter dropdown
  const conferences = ['all', ...new Set(dummyTeamData.map(team => team.conference))];
  
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleConferenceChange = (event: SelectChangeEvent) => {
    setFilterConference(event.target.value);
  };

  // Filter and sort data
  const filteredAndSortedData = [...dummyTeamData]
    // Filter by search term
    .filter(team => {
      if (!searchTerm) return true;
      return team.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    // Filter by conference
    .filter(team => {
      if (filterConference === 'all') return true;
      return team.conference === filterConference;
    })
    // Sort data
    .sort((a, b) => {
      const aValue = a[orderBy as keyof TeamRating];
      const bValue = b[orderBy as keyof TeamRating];
      
      if (order === 'desc') {
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return bValue - aValue;
        }
        return String(bValue).localeCompare(String(aValue));
      } else {
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue;
        }
        return String(aValue).localeCompare(String(bValue));
      }
    });
  
  // Calculate stats for the filtered data
  const avgPowerRating = filteredAndSortedData.length > 0 
    ? filteredAndSortedData.reduce((sum, team) => sum + team.powerRating, 0) / filteredAndSortedData.length
    : 0;

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      {/* Enhanced Hero Section */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          px: { xs: 2, sm: 3, md: 4 },
          mb: 6,
          borderRadius: { xs: 0, md: '0 0 32px 32px' },
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated Background Elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '150%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'float 20s ease-in-out infinite',
            zIndex: 0,
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-20px) rotate(5deg)' }
            }
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.05,
            backgroundImage: 'url(https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in={true} timeout={1200}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 900,
                  fontSize: { xs: '2.8rem', sm: '4rem', md: '5rem' },
                  mb: 3,
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(45deg, #ffffff 30%, rgba(255,255,255,0.8) 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                College Football
                <br />
                <Box component="span" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Power Analytics
                </Box>
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 300,
                  opacity: 0.95,
                  mb: 5,
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.3rem' }
                }}
              >
                Advanced predictive modeling and comprehensive analytics 
                <br />
                for college football teams nationwide
              </Typography>
            </Box>
          </Fade>
          
          {/* Enhanced Dashboard Stats */}
          <Zoom in={true} style={{ transitionDelay: '400ms' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3, 
                mb: 6,
                justifyContent: 'center'
              }}
            >
              <Box sx={{ flex: { xs: '1 1 45%', md: '1 1 22%' }, minWidth: 200 }}>
                <Card 
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    textAlign: 'center',
                    py: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
                    }
                  }}
                >
                  <CardContent sx={{ pb: '24px !important' }}>
                    <Box 
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <SchoolIcon sx={{ fontSize: 30 }} />
                    </Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {dummyTeamData.length}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Teams Tracked
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: { xs: '1 1 45%', md: '1 1 22%' }, minWidth: 200 }}>
                <Card 
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    textAlign: 'center',
                    py: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
                    }
                  }}
                >
                  <CardContent sx={{ pb: '24px !important' }}>
                    <Box 
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <EmojiEventsIcon sx={{ fontSize: 30 }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      sx={{ 
                        mb: 1,
                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                        minHeight: '2.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {filteredAndSortedData.length > 0 ? filteredAndSortedData[0].name : 'N/A'}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Top Ranked
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: { xs: '1 1 45%', md: '1 1 22%' }, minWidth: 200 }}>
                <Card 
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    textAlign: 'center',
                    py: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
                    }
                  }}
                >
                  <CardContent sx={{ pb: '24px !important' }}>
                    <Box 
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <EqualizerIcon sx={{ fontSize: 30 }} />
                    </Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {avgPowerRating.toFixed(1)}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Avg Rating
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: { xs: '1 1 45%', md: '1 1 22%' }, minWidth: 200 }}>
                <Card 
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    textAlign: 'center',
                    py: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
                    }
                  }}
                >
                  <CardContent sx={{ pb: '24px !important' }}>
                    <Box 
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <SportsFootballIcon sx={{ fontSize: 30 }} />
                    </Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {conferences.length - 1}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Conferences
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Zoom>
          
          {/* Enhanced Action Buttons */}
          <Zoom in={true} style={{ transitionDelay: '800ms' }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              sx={{ justifyContent: 'center', alignItems: 'center' }}
            >
              <Button 
                variant="contained" 
                size="large"
                startIcon={<TrendingUpIcon />}
                sx={{ 
                  fontWeight: 700, 
                  px: 5, 
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  color: 'white',
                  minWidth: 200,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.35)',
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.6)'
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                component={Link}
                to="/predictions"
              >
                View Predictions
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                startIcon={<InfoOutlinedIcon />}
                sx={{ 
                  fontWeight: 600, 
                  px: 5, 
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                  borderWidth: '2px',
                  color: 'white',
                  minWidth: 200,
                  '&:hover': {
                    borderColor: 'white',
                    borderWidth: '2px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                component={Link}
                to="/methodology"
              >
                Explore Methodology
              </Button>
            </Stack>
          </Zoom>
        </Container>
      </Box>
      
      <Container maxWidth="lg">
        {/* Condensed Stats Row */}
        <Box sx={{ mb: 2, mt: { xs: 0, md: -4 } }}>
          <Zoom in={true} style={{ transitionDelay: '200ms' }}>
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                gap: { xs: 1, sm: 2 }
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  minWidth: '120px'
                }}>
                  <SchoolIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Teams
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {dummyTeamData.length}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  minWidth: '120px'
                }}>
                  <FilterListIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Teams in View
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {filteredAndSortedData.length}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  minWidth: '150px'
                }}>
                  <EqualizerIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Avg Power Rating
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {avgPowerRating.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  minWidth: '150px'
                }}>
                  <TrendingUpIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Top Team
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {filteredAndSortedData.length > 0 ? filteredAndSortedData[0].name : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Zoom>
        </Box>
      
        {/* Search and Filter Controls */}
        <Box 
          sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            mb: 3, 
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ mr: 1 }} /> Filter Teams
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newView) => newView && setViewMode(newView)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="table" aria-label="table view">
                  <ViewListIcon sx={{ mr: 1, fontSize: 18 }} />
                  Table
                </ToggleButton>
                <ToggleButton value="cards" aria-label="card view">
                  <ViewModuleIcon sx={{ mr: 1, fontSize: 18 }} />
                  Cards
                </ToggleButton>
              </ToggleButtonGroup>
              
              <Divider orientation="vertical" flexItem />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  {filteredAndSortedData.length} teams
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            alignItems: { xs: 'stretch', sm: 'center' },
          }}>
            <TextField
              placeholder="Search teams..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl sx={{ minWidth: { xs: '100%', sm: 220 } }}>
              <InputLabel id="conference-filter-label">Conference</InputLabel>
              <Select
                labelId="conference-filter-label"
                value={filterConference}
                label="Conference"
                onChange={handleConferenceChange}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.2)
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                {conferences.map((conf) => (
                  <MenuItem key={conf} value={conf}>
                    {conf === 'all' ? 'All Conferences' : conf}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        {/* Table with Ratings */}
        <Fade in={true} timeout={800}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              maxHeight: '85vh',
              borderRadius: 3,
              overflow: 'auto',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              '& .MuiTableCell-head': {
                fontWeight: 600,
                whiteSpace: 'nowrap'
              },
              '& .MuiTableCell-root': {
                padding: '8px 16px'
              }
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="team ratings table">
              <TableHead sx={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: theme.palette.background.paper }}>
                <TableRow sx={{ 
                  backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : '#f5f5f5',
                  '& th': {
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }
                }}>
                  <TableCell>Rank</TableCell>
                  <TableCell>Team</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TableSortLabel
                        active={orderBy === 'powerRating'}
                        direction={orderBy === 'powerRating' ? order : 'asc'}
                        onClick={() => handleRequestSort('powerRating')}
                      >
                        Power Rating
                      </TableSortLabel>
                      <Tooltip title="Overall team strength rating">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TableSortLabel
                        active={orderBy === 'ypp'}
                        direction={orderBy === 'ypp' ? order : 'asc'}
                        onClick={() => handleRequestSort('ypp')}
                      >
                        YPP
                      </TableSortLabel>
                      <Tooltip title="Net Yards Per Play (offYPP - defYPP)">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TableSortLabel
                        active={orderBy === 'appd'}
                        direction={orderBy === 'appd' ? order : 'asc'}
                        onClick={() => handleRequestSort('appd')}
                      >
                        APPD
                      </TableSortLabel>
                      <Tooltip title="Adjusted Points Per Drive">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TableSortLabel
                        active={orderBy === 'defensiveSuccessRate'}
                        direction={orderBy === 'defensiveSuccessRate' ? order : 'asc'}
                        onClick={() => handleRequestSort('defensiveSuccessRate')}
                      >
                        Def Success
                      </TableSortLabel>
                      <Tooltip title="Defensive Success Rate - Percentage of plays that prevent the offense from staying on schedule">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TableSortLabel
                        active={orderBy === 'explosivePlayDiff'}
                        direction={orderBy === 'explosivePlayDiff' ? order : 'asc'}
                        onClick={() => handleRequestSort('explosivePlayDiff')}
                      >
                        Explosive
                      </TableSortLabel>
                      <Tooltip title="Explosive Play Differential - Difference between offensive and defensive explosive plays per game">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TableSortLabel
                        active={orderBy === 'thirdDownDiff'}
                        direction={orderBy === 'thirdDownDiff' ? order : 'asc'}
                        onClick={() => handleRequestSort('thirdDownDiff')}
                      >
                        3rd Down
                      </TableSortLabel>
                      <Tooltip title="Third Down Differential - Difference between offensive and defensive third down conversion rates">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TableSortLabel
                        active={orderBy === 'turnoverMargin'}
                        direction={orderBy === 'turnoverMargin' ? order : 'asc'}
                        onClick={() => handleRequestSort('turnoverMargin')}
                      >
                        TO Margin
                      </TableSortLabel>
                      <Tooltip title="Turnover Margin - Average turnovers forced minus turnovers committed per game">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TableSortLabel
                        active={orderBy === 'sos'}
                        direction={orderBy === 'sos' ? order : 'asc'}
                        onClick={() => handleRequestSort('sos')}
                      >
                        SOS
                      </TableSortLabel>
                      <Tooltip title="Strength of Schedule - Measure of opponent difficulty based on their power ratings">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TableSortLabel
                        active={orderBy === 'homeFieldAdvantage'}
                        direction={orderBy === 'homeFieldAdvantage' ? order : 'asc'}
                        onClick={() => handleRequestSort('homeFieldAdvantage')}
                      >
                        Home Adv
                      </TableSortLabel>
                      <Tooltip title="Home Field Advantage - Rating on a scale of 0-5.5 points">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedData.map((team, index) => {
                  const actualRank = index + 1;
                  return (
                    <TableRow 
                      key={team.id}
                      sx={{ 
                        '&:nth-of-type(odd)': { 
                          backgroundColor: alpha(theme.palette.background.default, 0.5) 
                        },
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          transition: 'all 0.3s ease',
                          transform: 'scale(1.005)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                        },
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <TableCell>{actualRank}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: '50%', 
                              backgroundColor: team.primaryColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              mr: 1.5,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              border: '2px solid #fff'
                            }}
                          >
                            {team.name.charAt(0)}
                          </Box>
                          <Box>
                            <Link 
                              to={`/team/${team.id}`} 
                              style={{ 
                                textDecoration: 'none', 
                                color: team.primaryColor,
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                display: 'block'
                              }}
                            >
                              {team.name}
                            </Link>
                            <Typography 
                              variant="caption" 
                              display="block" 
                              color="text.secondary"
                              sx={{ opacity: 0.8, mt: 0.2 }}
                            >
                              {team.conference}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {team.powerRating.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>{team.ypp.toFixed(1)}</TableCell>
                      <TableCell>{team.appd.toFixed(2)}</TableCell>
                      <TableCell>{(team.defensiveSuccessRate * 100).toFixed(1)}%</TableCell>
                      <TableCell>{team.explosivePlayDiff.toFixed(2)}</TableCell>
                      <TableCell>{(team.thirdDownDiff * 100).toFixed(1)}%</TableCell>
                      <TableCell>{team.turnoverMargin.toFixed(2)}</TableCell>
                      <TableCell>{team.sos.toFixed(2)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ minWidth: '24px' }}>
                            {team.homeFieldAdvantage.toFixed(1)}
                          </Typography>
                          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                            <LinearProgress
                              variant="determinate"
                              value={(team.homeFieldAdvantage / 5.5) * 100}
                              sx={{
                                width: '100%',
                                height: 8,
                                borderRadius: 5,
                                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: team.primaryColor,
                                  borderRadius: 5
                                }
                              }}
                            />
                          </Box>
                          <StadiumIcon 
                            fontSize="small" 
                            sx={{ 
                              color: team.homeFieldAdvantage >= 3.5 ? theme.palette.success.main : 
                                    team.homeFieldAdvantage >= 2.5 ? theme.palette.info.main : 
                                    theme.palette.text.secondary,
                              opacity: team.homeFieldAdvantage >= 3.0 ? 1 : 0.7
                            }} 
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
        
        {/* Team count info */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 3 }}>
          <Zoom in={true} style={{ transitionDelay: '500ms' }}>
            <Typography variant="body2" color="text.secondary">
              Showing all {filteredAndSortedData.length} teams
            </Typography>
          </Zoom>
        </Box>
      </Container>
    </Box>
  );
};

export default TeamRatings;
