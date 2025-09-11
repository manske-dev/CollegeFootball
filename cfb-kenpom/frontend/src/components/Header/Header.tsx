import {
  AppBar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  useTheme,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Chip,
  Divider,
  alpha,
  useScrollTrigger
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BuildIcon from '@mui/icons-material/Build';
import ExploreIcon from '@mui/icons-material/Explore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useState } from 'react';
import type { PaletteMode } from '@mui/material';

interface HeaderProps {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

const Header: React.FC<HeaderProps> = ({ toggleColorMode, mode }) => {
  const theme = useTheme();
  const location = useLocation();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };


  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const navItems = [
    { path: '/', label: 'RATINGS', icon: <StarIcon /> },
    { path: '/predictions', label: 'PREDICTIONS', icon: <TrendingUpIcon /> },
    { path: '/analytics', label: 'ANALYTICS', icon: <AnalyticsIcon /> },
    { path: '/matchup-builder', label: 'MATCHUP BUILDER', icon: <BuildIcon /> },
    { path: '/statistical-explorer', label: 'EXPLORER', icon: <ExploreIcon /> },
    { path: '/heisman-race', label: 'HEISMAN RACE', icon: <EmojiEventsIcon /> },
    { path: '/conference-dashboard', label: 'CONFERENCE STATS', icon: <AnalyticsIcon /> },
    { path: '/team-schedule', label: 'TEAM SCHEDULE', icon: <StarIcon /> },
    { path: '/conference-predictions', label: 'PREDICTIONS', icon: <TrendingUpIcon /> },
    { path: '/player-projections', label: 'PLAYER PROJECTIONS', icon: <EmojiEventsIcon /> },
    { path: '/methodology', label: 'METHODOLOGY', icon: <FlashOnIcon /> }
  ];

  return (
    <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: trigger 
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.95)} 0%, ${alpha(theme.palette.secondary.main, 0.95)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
          backdropFilter: 'blur(20px)',
          borderBottom: 'none',
          boxShadow: trigger 
            ? '0 8px 32px rgba(0,0,0,0.12)' 
            : '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: theme.zIndex.drawer + 1,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            animation: 'shimmer 3s ease-in-out infinite',
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' }
            }
          }
        }}
      >
      {/* Top Bar with Branding */}
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 1.5
          }}
        >
          {/* Enhanced Logo and Branding */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              component={Link} 
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              {/* Animated Football Icon */}
              <Box 
                sx={{
                  position: 'relative',
                  mr: 2,
                  '&:hover .football-icon': {
                    transform: 'rotate(360deg) scale(1.1)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }
                }}
              >
                <SportsFootballIcon 
                  className="football-icon"
                  sx={{ 
                    fontSize: '2.5rem',
                    color: 'white',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    transform: 'rotate(-15deg)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} 
                />
                {/* Glow Effect */}
                <Box 
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '3rem',
                    height: '3rem',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 0.5, transform: 'translate(-50%, -50%) scale(1)' },
                      '50%': { opacity: 0.8, transform: 'translate(-50%, -50%) scale(1.2)' }
                    }
                  }}
                />
              </Box>
              
              {/* Enhanced Typography */}
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 900, 
                    color: 'white',
                    textDecoration: 'none',
                    letterSpacing: -1,
                    display: { xs: 'none', sm: 'block' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    background: 'linear-gradient(45deg, #ffffff 30%, rgba(255,255,255,0.8) 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  CFB<Box component="span" sx={{ color: '#FFD700', WebkitTextFillColor: '#FFD700' }}>ANALYTICS</Box>
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 500,
                    letterSpacing: 2,
                    display: { xs: 'none', md: 'block' },
                    textTransform: 'uppercase'
                  }}
                >
                  Advanced Football Intelligence
                </Typography>
              </Box>
            </Box>
            
            {/* Live Status Chip */}
            <Chip 
              icon={<FlashOnIcon sx={{ fontSize: 16 }} />}
              label="LIVE"
              size="small"
              sx={{
                ml: 2,
                background: 'linear-gradient(45deg, #ff4444 30%, #ff6666 90%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
                animation: 'blink 2s ease-in-out infinite',
                display: { xs: 'none', md: 'flex' },
                '@keyframes blink': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.7 }
                }
              }}
            />
          </Box>

          {/* Enhanced Right Side Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {/* Search Button */}
            <Tooltip title="Search teams and stats">
              <IconButton 
                sx={{ 
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: { xs: 'none', md: 'flex' },
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
            
            {/* Notifications */}
            <Tooltip title="Latest updates & alerts">
              <IconButton 
                sx={{ 
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: { xs: 'none', md: 'flex' },
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Badge 
                  badgeContent={3} 
                  sx={{
                    '& .MuiBadge-badge': {
                      background: 'linear-gradient(45deg, #ff4444 30%, #ff6666 90%)',
                      color: 'white',
                      fontWeight: 'bold',
                      animation: 'bounce 2s ease-in-out infinite',
                      '@keyframes bounce': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.2)' }
                      }
                    }
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
              <IconButton 
                onClick={toggleColorMode} 
                sx={{ 
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.1) rotate(180deg)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.4s ease'
                }}
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            
            {/* Mobile Menu */}
            <IconButton 
              sx={{ 
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: { md: 'none' },
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
      
      {/* Enhanced Navigation Bar */}
      <Box 
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(theme.palette.secondary.dark, 0.9)} 100%)`,
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
          }
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Modern Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button 
                    key={item.path}
                    component={Link} 
                    to={item.path}
                    startIcon={item.icon}
                    sx={{ 
                      color: 'white',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.9rem',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      position: 'relative',
                      background: isActive 
                        ? 'linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)' 
                        : 'transparent',
                      border: isActive 
                        ? '1px solid rgba(255,255,255,0.3)' 
                        : '1px solid transparent',
                      backdropFilter: isActive ? 'blur(10px)' : 'none',
                      '&:hover': {
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      },
                      '&::after': isActive ? {
                        content: '""',
                        position: 'absolute',
                        bottom: -1,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: '3px',
                        background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                        borderRadius: '2px 2px 0 0',
                        boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)'
                      } : {},
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
            
            {/* Enhanced Date Display with Live Indicator */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #00ff00 0%, #32cd32 100%)',
                    animation: 'pulse 2s ease-in-out infinite',
                    boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                      '50%': { opacity: 0.7, transform: 'scale(1.2)' }
                    }
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  Live Data
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500,
                  fontSize: '0.85rem'
                }}
              >
                {currentDate}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Enhanced Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${alpha(theme.palette.secondary.dark, 0.95)} 100%)`,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }
        }}
      >
        {navItems.map((item) => (
          <MenuItem 
            key={item.path}
            onClick={handleMobileMenuClose} 
            component={Link} 
            to={item.path}
            sx={{
              color: 'white',
              py: 1.5,
              px: 2,
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
                transform: 'translateX(8px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {item.icon}
              <Typography variant="body2" fontWeight={500}>
                {item.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Header;
