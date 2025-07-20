import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Chip,
  InputAdornment,
  Fade,
} from '@mui/material';
import type { AlertColor } from '@mui/material/Alert';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import axios from 'axios';
import { fetchRideGroups } from '../store/rideGroupSlice';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';

// Constants
const PRIMARY_COLOR = '#2C3E50';
const ACCENT_COLOR = '#FF6B6B';
const BACKGROUND_COLOR = '#F8FAFC';
const BORDER_COLOR = '#E2E8F0';
const SUCCESS_COLOR = '#10B981';
const TEXT_PRIMARY_COLOR = '#2C3E50';


const calculateNextRideDate = (days: string[]): Date | null => {
  if (!days || days.length === 0) return null;
  const dayMap: { [key: string]: number } = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
  const allowedDays = days.map(day => dayMap[day]).filter(d => d !== undefined);
  if (allowedDays.length === 0) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    if (allowedDays.includes(nextDate.getDay())) {
      return nextDate;
    }
  }
  return null;
};


const RideGroupsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { groups, loading, error } = useAppSelector((state) => state.rideGroups);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor; }>({ open: false, message: '', severity: 'info' });
  const [filters, setFilters] = useState({ day: '', origin: '', destination: '', departureFrom: '', departureTo: '' });
  const [showFilters, setShowFilters] = useState(false);


  useEffect(() => { dispatch(fetchRideGroups()); }, [dispatch]);

  const handleJoinGroup = async (groupId: string) => {
    const group = groups.find((g: any) => g._id === groupId);
    if (!group) { setSnackbar({ open: true, message: 'Error: Group not found.', severity: 'error' }); return; }
    const nextRideDate = calculateNextRideDate(group.days);
    if (!nextRideDate) { setSnackbar({ open: true, message: 'This group has no valid upcoming ride days.', severity: 'warning' }); return; }
    const [hours, minutes] = group.departureTime.split(':');
    nextRideDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    try {
      setJoiningId(groupId);
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:8000/api/booking/`, { rideGroupId: groupId, rideDate: nextRideDate.toISOString(), seatsRequested: 1, pickupLocation: 'To be determined by user' }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
      if (res.data.status === 'REJECTED') {
        setSnackbar({ open: true, message: 'Request rejected – no available seats', severity: 'warning' });
      } else {
        setSnackbar({ open: true, message: 'Join request sent and pending approval.', severity: 'info' });
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.error?.message || 'Error in join request', severity: 'error' });
    } finally {
      setJoiningId(null);
    }
  };

  const handleJoinClick = (groupId: string) => {
    const token = localStorage.getItem('token');
    if (token) {
      handleJoinGroup(groupId);
    } else {
      navigate(`/signin?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    }
  };

  const clearFilters = () => {
    setFilters({ day: '', origin: '', destination: '', departureFrom: '', departureTo: '' });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  const filteredGroups = groups.filter((group: any) => {
    const dayMatch = filters.day ? group.days.includes(filters.day) : true;
    const originMatch = filters.origin ? group.origin.toLowerCase().includes(filters.origin.toLowerCase()) : true;
    const destinationMatch = filters.destination ? group.destination.toLowerCase().includes(filters.destination.toLowerCase()) : true;
    const departureMatch = (() => {
      if (!filters.departureFrom && !filters.departureTo) return true;
      const groupTime = parseInt(group.departureTime?.split(':')[0], 10);
      const from = filters.departureFrom ? parseInt(filters.departureFrom, 10) : 0;
      const to = filters.departureTo ? parseInt(filters.departureTo, 10) : 23;
      return groupTime >= from && groupTime <= to;
    })();
    return dayMatch && originMatch && destinationMatch && departureMatch;
  });

  return (
    <Box sx={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} color={PRIMARY_COLOR} gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Find a Ride Group
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '20px',
            mb: 5,
            border: `1px solid ${BORDER_COLOR}`,
            background: '#FFFFFF',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FilterListIcon sx={{ color: PRIMARY_COLOR }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: TEXT_PRIMARY_COLOR }}>
                Filter & Search
              </Typography>
              {hasActiveFilters && (
                <Chip
                  label={`${Object.values(filters).filter(f => f !== '').length} active`}
                  size="small"
                  sx={{ backgroundColor: ACCENT_COLOR, color: 'white', fontWeight: 600 }}
                />
              )}
            </Box>
            <Button
              variant="text"
              startIcon={showFilters ? <ClearIcon /> : <SearchIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ color: PRIMARY_COLOR, fontWeight: 600, textTransform: 'none' }}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </Box>

          <Fade in={showFilters}>
            <Box sx={{ display: showFilters ? 'block' : 'none' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md>
                  <TextField
                    fullWidth
                    label="From (Origin)"
                    variant="outlined"
                    value={filters.origin}
                    onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: ACCENT_COLOR }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md>
                  <TextField
                    fullWidth
                    label="To (Destination)"
                    variant="outlined"
                    value={filters.destination}
                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: SUCCESS_COLOR }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Day</InputLabel>
                    <Select
                      label="Day"
                      value={filters.day}
                      onChange={(e) => setFilters({ ...filters, day: e.target.value })}
                      sx={{ borderRadius: '12px', '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
                    >
                      <MenuItem value="">All Days</MenuItem>
                      <MenuItem value="Sunday">Sunday</MenuItem>
                      <MenuItem value="Monday">Monday</MenuItem>
                      <MenuItem value="Tuesday">Tuesday</MenuItem>
                      <MenuItem value="Wednesday">Wednesday</MenuItem>
                      <MenuItem value="Thursday">Thursday</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3} md>
                  <TextField
                    fullWidth
                    type="number"
                    label="From Hour"
                    variant="outlined"
                    value={filters.departureFrom}
                    onChange={(e) => setFilters({ ...filters, departureFrom: e.target.value })}
                    inputProps={{ min: 0, max: 23 }}
                    sx={{ '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md>
                  <TextField
                    fullWidth
                    type="number"
                    label="To Hour"
                    variant="outlined"
                    value={filters.departureTo}
                    onChange={(e) => setFilters({ ...filters, departureTo: e.target.value })}
                    inputProps={{ min: 0, max: 23 }}
                    sx={{ '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
                  />
                </Grid>
              </Grid>

              {hasActiveFilters && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={clearFilters}
                    sx={{
                      borderColor: ACCENT_COLOR,
                      color: ACCENT_COLOR,
                      fontWeight: 600,
                      borderRadius: '12px',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#E55A5A',
                        backgroundColor: 'rgba(255, 107, 107, 0.08)',
                      },
                    }}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              )}
            </Box>
          </Fade>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: PRIMARY_COLOR }} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredGroups.length > 0 ? filteredGroups.map((group: any) => (
              <Grid item xs={12} sm={6} md={4} key={group._id}>
                <Paper elevation={3} sx={{ p: 2.5, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 2 }}>
                  {group.groupImageURL && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img
                        src={group.groupImageURL}
                        alt="Group Car"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 160,
                          borderRadius: 12,
                          objectFit: 'cover',
                          boxShadow: '0 2px 8px rgba(44,62,80,0.08)'
                        }}
                      />
                    </Box>
                  )}
                  <Box>
                    <Typography variant="h6" sx={{ color: PRIMARY_COLOR, fontWeight: 600, fontSize: '1.1rem' }}>{group.groupName}</Typography>
                    {group.driverName && (
                      <Typography variant="body2" sx={{ color: ACCENT_COLOR, fontWeight: 500 }}>
                        Driver: {group.driverName}
                      </Typography>
                    )}
                    <Typography variant="body1" sx={{ color: '#444' }}>{group.origin}   {group.destination}</Typography>
                    <Typography variant="body2" color="text.secondary">Days: {group.days.join(', ')}</Typography>
                    <Typography variant="body2" color="text.secondary">Departure: {group.departureTime}</Typography>
                    {group.returnTime && (<Typography variant="body2" color="text.secondary">Return: {group.returnTime}</Typography>)}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Available Seats: {group.capacityTotal}</Typography>
                  </Box>
                  <Box sx={{ width: '100%', mt: 'auto' }}>
                    <Button
                      variant="contained"
                      onClick={() => handleJoinClick(group._id)}
                      disabled={joiningId === group._id}
                      fullWidth
                      sx={{ backgroundColor: PRIMARY_COLOR, color: '#FFFFFF', fontWeight: 600, py: 1.2, '&:hover': { backgroundColor: '#1A252F' } }}
                    >
                      {joiningId === group._id ? <CircularProgress size={24} color="inherit" /> : 'Request to Join'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            )) : (
              <Grid item xs={12}>
                <Alert severity="info">No ride groups match your filters. Try broadening your search!</Alert>
              </Grid>
            )}
          </Grid>
        )}

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default RideGroupsList;