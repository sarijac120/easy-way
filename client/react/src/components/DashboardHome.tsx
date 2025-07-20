import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Paper,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchRideGroups } from '../store/rideGroupSlice';

const PRIMARY_COLOR = '#2C3E50';
const ACCENT_COLOR = '#FF6B6B';
const BACKGROUND_COLOR = '#F7F9FC'; 

const AllGroupsOverview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { groups, loading, error } = useAppSelector((state) => state.rideGroups);

  //lowading and error states are managed in the Redux slice
  useEffect(() => {
    dispatch(fetchRideGroups());
  }, [dispatch]);

  return (
    <Box sx={{ backgroundColor: BACKGROUND_COLOR, py: { xs: 3, md: 5 }, borderRadius: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight={600} color={PRIMARY_COLOR} gutterBottom sx={{ mb: 4 }}>
          Explore Active Ride Groups
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress sx={{ color: PRIMARY_COLOR }} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {groups && groups.length > 0 ? groups.map((group: any) => (
              // grid for the group card
              <Grid item xs={12} sm={6} md={4} key={group._id}>
                <Paper elevation={2} sx={{ p: 2.5, borderRadius: 4, display: 'flex', flexDirection: 'column', height: '100%', gap: 1.5, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 12px rgba(44,62,80,0.1)' } }}>
                  {group.groupImageURL && (
                    <Box sx={{ mb: 1, textAlign: 'center' }}>
                      <img
                        src={group.groupImageURL}
                        alt="Group Car"
                        style={{
                          width: '100%',
                          height: 150,
                          borderRadius: 12,
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  )}
                  <Box>
                    <Typography variant="h6" sx={{ color: PRIMARY_COLOR, fontWeight: 600, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {group.groupName}
                    </Typography>
                     {group.driverName && (
                      <Typography variant="body2" sx={{ color: ACCENT_COLOR, fontWeight: 500 }}>
                        Driver: {group.driverName}
                      </Typography>
                    )}
                    <Typography variant="body1" sx={{ color: '#444' }}>{group.origin} → {group.destination}</Typography>
                    <Typography variant="body2" color="text.secondary">Days: {group.days.join(', ')}</Typography>
                    <Typography variant="body2" color="text.secondary">Departure: {group.departureTime}</Typography>
                    <Typography variant="body2" color="text.secondary">Available Seats: {group.capacityTotal}</Typography>
                  </Box>
                </Paper>
              </Grid>
            )) : (
                <Grid item xs={12}>
                    <Alert severity="info">No ride groups have been created yet. Be the first!</Alert>
                </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AllGroupsOverview;