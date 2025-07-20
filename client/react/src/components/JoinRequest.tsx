import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Alert,
  Box,
  Divider,
  Chip,
  Button,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const PRIMARY_BLUE = '#2C3E50';
const PRIMARY_PINK = '#FF6B6B';
const BACKGROUND_COLOR = '#f7f9fc';

// טיפוסים
type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

interface Booking {
  _id: string;
  rideDate: string;
  status: BookingStatus;
  seatsRequested: number;
  pickupLocation?: string;
  price?: number;
  rideGroupId: {
    _id: string;
    groupName: string;
    origin: string;
    destination: string;
    time: string;
  };
}

// filter options
const filterOptions: { value: BookingStatus | 'ALL', label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

const UserBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async (statusFilter: string) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8000/api/booking/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
          params: statusFilter !== 'ALL' ? { status: statusFilter } : {},
        });
        const formattedData = res.data.map((b: any) => ({
          ...b,
          rideGroupId: {
            ...b.rideGroupId,
            groupName: b.rideGroupId.name || "Unnamed Group",
            time: b.rideGroupId.departureTime || b.rideGroupId.time
          }
        }));
        setBookings(formattedData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch your bookings.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings(activeFilter);
  }, [activeFilter]);

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8000/api/booking/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.map(b => b._id === bookingId ? { ...b, status: 'CANCELLED' } : b));
    } catch (err: any) {
      console.error("Failed to cancel booking:", err);
      // Optional: Show a snackbar error message to the user
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusChip = (bookingStatus: BookingStatus) => {
    const chipProps = {
      label: bookingStatus.charAt(0) + bookingStatus.slice(1).toLowerCase(),
      sx: { color: 'white', fontWeight: '600' }
    };
    switch (bookingStatus) {
      case 'APPROVED':
        return <Chip {...chipProps} sx={{...chipProps.sx, bgcolor: PRIMARY_BLUE}} />;
      case 'REJECTED':
        return <Chip {...chipProps} sx={{...chipProps.sx, bgcolor: PRIMARY_PINK}} />;
      case 'CANCELLED':
        return <Chip {...chipProps} sx={{...chipProps.sx, bgcolor: '#95a5a6'}} />;
      case 'PENDING':
        return <Chip {...chipProps} sx={{...chipProps.sx, bgcolor: '#f39c12'}} />;
      default:
        return <Chip label={bookingStatus} />;
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <Grid item xs={12} sm={6} md={4} key={booking._id}>
      <Paper
        sx={{
          p: 3,
          borderRadius: '16px',
          border: '1px solid #e0e0e0',
          transition: 'transform 0.3s, box-shadow 0.3s',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 20px rgba(44, 62, 80, 0.1)',
          },
        }}
        elevation={0}
      >
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1.5 }}>
              <Typography variant="h6" fontWeight={700} color={PRIMARY_BLUE}>
                {booking.rideGroupId.groupName}
              </Typography>
              {getStatusChip(booking.status)}
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <DirectionsCarIcon sx={{ mr: 1.5, color: PRIMARY_PINK }} />
              <Typography variant="body1">
                {booking.rideGroupId.origin} → {booking.rideGroupId.destination}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <CalendarTodayIcon sx={{ mr: 1.5, color: PRIMARY_PINK }} />
              <Typography variant="body1">
                Date: <strong>{new Date(booking.rideDate).toLocaleDateString('en-GB')}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <AirlineSeatReclineNormalIcon sx={{ mr: 1.5, color: PRIMARY_PINK }} />
              <Typography variant="body1">
                Seats: <strong>{booking.seatsRequested}</strong>
              </Typography>
            </Box>
            {booking.pickupLocation && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <LocationOnIcon sx={{ mr: 1.5, color: PRIMARY_PINK }} />
                <Typography variant="body1">Pickup: {booking.pickupLocation}</Typography>
              </Box>
            )}
        </Box>

        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {booking.price !== undefined ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon sx={{ mr: 1, color: PRIMARY_BLUE }} />
                    <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                        ₪{booking.price}
                    </Typography>
                </Box>
            ) : <Box />}

            {booking.status === 'PENDING' && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleCancel(booking._id)}
                disabled={cancellingId === booking._id}
              >
                {cancellingId === booking._id ? <CircularProgress size={20} color="inherit" /> : 'Cancel'}
              </Button>
            )}
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 6, pb: 4, backgroundColor: BACKGROUND_COLOR, minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} color={PRIMARY_BLUE} gutterBottom sx={{ textAlign: 'center', mb: 4, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
        My Ride Requests
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap', mb: 5 }}>
        {filterOptions.map((option) => (
            <Chip
                key={option.value}
                label={option.label}
                onClick={() => setActiveFilter(option.value)}
                variant={activeFilter === option.value ? 'filled' : 'outlined'}
                color={activeFilter === option.value ? 'primary' : 'default'}
                sx={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    px: 1,
                    py: 2.5,
                    bgcolor: activeFilter === option.value ? PRIMARY_BLUE : 'transparent',
                    '&:hover': {
                        bgcolor: activeFilter === option.value ? '#1A242F' : 'rgba(44, 62, 80, 0.05)',
                    }
                }}
            />
        ))}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: PRIMARY_BLUE }} size={50} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {bookings.length > 0 ? (
            bookings.map(renderBookingCard)
          ) : (
            <Grid item xs={12}>
                <Alert severity="info" sx={{ borderRadius: 2, mt: 2 }}>
                    You have no ride requests with the selected status.
                </Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default UserBookings;