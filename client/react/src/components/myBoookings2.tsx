// import React, { useEffect, useState, useMemo } from 'react';
// import axios from 'axios';
// import {
//   Container,
//   Typography,
//   Paper,
//   CircularProgress,
//   Alert,
//   Box,
//   Chip,
//   Button,
//   ButtonGroup
// } from '@mui/material';

// const PRIMARY_COLOR = '#2C3E50';
// const SECONDARY_COLOR = '#ECF0F1';
// const BACKGROUND_COLOR = '#FDFDFD';

// type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

// interface Booking {
//   _id: string;
//   rideGroupId: {
//     _id: string;
//     groupName: string;
//     origin: string;
//     destination: string;
//     departureTime: string;
//   };
//   rideDate: string;
//   status: BookingStatus;
//   pickupLocation?: string;
// }

// const MyBookings: React.FC = () => {
//   const [allBookings, setAllBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');

//   // --- שינוי 1: הוספת State למעקב אחר ביטול בקשה ---
//   const [cancellingId, setCancellingId] = useState<string | null>(null);

//   useEffect(() => {
//     // ... לוגיקת fetchBookings נשארת זהה
//     const fetchBookings = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('token');
//             const res = await axios.get('http://localhost:8000/api/booking/my-bookings', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             if (Array.isArray(res.data)) {
//                 setAllBookings(res.data);
//             } else {
//                 setError('Received invalid data format from server.');
//             }
//         } catch (err: any) {
//             setError(err.response?.data?.error?.message || 'Failed to load your bookings.');
//         } finally {
//             setLoading(false);
//         }
//     };
//     fetchBookings();
//   }, []);
  
//   // --- שינוי 2: פונקציה חדשה לטיפול בביטול בקשה ---
//   const handleCancelBooking = async (bookingId: string) => {
//     setCancellingId(bookingId); // הצג חיווי טעינה
//     try {
//       const token = localStorage.getItem('token');
//       await axios.patch(
//         `http://localhost:8000/api/booking/${bookingId}/cancel`,
//         {}, // גוף הבקשה ריק כי המידע נשלח ב-URL
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//     console.log(bookingId)
//       // עדכון מיידי של הממשק לאחר הצלחה
//       setAllBookings(prevBookings =>
//         prevBookings.map(booking =>
//           booking._id === bookingId ? { ...booking, status: 'CANCELLED' } : booking
//         )
//       );

//     } catch (err: any) {
//       // טיפול בשגיאה אם הביטול נכשל
//       console.error("Failed to cancel booking:", err);
//       // כאן אפשר להוסיף Snackbar לשגיאה
//     } finally {
//       setCancellingId(null); // הסתר חיווי טעינה
//     }
//   };


//   const filteredBookings = useMemo(() => {
//     if (statusFilter === 'ALL') return allBookings;
//     return allBookings.filter(booking => booking.status === statusFilter);
//   }, [allBookings, statusFilter]);

//   const filterOptions: (BookingStatus | 'ALL')[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

//   return (
//     <Container maxWidth="md" sx={{ mt: 10, backgroundColor: BACKGROUND_COLOR, pb: 4 }}>
//       <Typography variant="h4" fontWeight={600} color={PRIMARY_COLOR} gutterBottom>
//         My Ride Bookings
//       </Typography>

//       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 2 }}>
//         <ButtonGroup variant="outlined" aria-label="booking status filter">
//           {filterOptions.map(status => (
//             <Button
//               key={status}
//               onClick={() => setStatusFilter(status)}
//               variant={statusFilter === status ? 'contained' : 'outlined'}
//             >
//               {status}
//             </Button>
//           ))}
//         </ButtonGroup>
//       </Box>

//       {loading ? (
//         <CircularProgress sx={{ mt: 4 }} />
//       ) : error ? (
//         <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
//       ) : allBookings.length === 0 ? (
//         <Alert severity="info" sx={{ mt: 4 }}>You haven't requested any rides yet.</Alert>
//       ) : filteredBookings.length === 0 ? (
//           <Alert severity="info" sx={{ mt: 4 }}>No bookings match the filter "{statusFilter}".</Alert>
//       ) : (
//         filteredBookings.map((booking) => (
//           <Paper
//             key={booking._id} 
//             sx={{ p: 3, mt: 3, borderRadius: 3, border: `1px solid ${SECONDARY_COLOR}` }}
//             elevation={1}
//           >
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//               <Typography variant="h6" fontWeight={600} color={PRIMARY_COLOR}>
//                 {booking.rideGroupId?.groupName || 'Group details missing'}
//               </Typography>
//               <Chip
//                 label={booking.status}
//                 color={
//                   booking.status === 'APPROVED' ? 'success' :
//                   booking.status === 'PENDING' ? 'warning' :
//                   booking.status === 'REJECTED' ? 'error' : 'default'
//                 }
//                 size="small"
//               />
//             </Box>
            
//             {/* ... פרטי הנסיעה נשארים זהים ... */}
//             {booking.rideGroupId && (
//                 <>
//                 <Typography variant="body1" sx={{ mt: 1 }}>Route: {booking.rideGroupId.origin} → {booking.rideGroupId.destination}</Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Departure Time: {booking.rideGroupId.departureTime}</Typography>
//                 </>
//             )}
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 'bold' }}>Ride Date: {new Date(booking.rideDate).toLocaleDateString()}</Typography>
//             {booking.pickupLocation && (<Typography variant="body2" color="text.secondary">Pickup: {booking.pickupLocation}</Typography>)}

//             {/* --- שינוי 3: הוספת כפתור הביטול --- */}
//             <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
//               <Button
//                 variant="text"
//                 color="error"
//                 size="small"
//                 onClick={() => handleCancelBooking(booking._id)}
//                 disabled={booking.status !== 'PENDING' || cancellingId === booking._id}
//               >
//                 {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Request'}
//               </Button>
//             </Box>
//           </Paper>
//         ))
//       )}
//     </Container>
//   );
// };

// export default MyBookings;








import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Button,
  ButtonGroup
} from '@mui/material';

// --- שינוי: איחוד פלטת הצבעים עם HomePage ---
const PRIMARY_COLOR = '#2C3E50';
const ACCENT_COLOR = '#FF6B6B';
const BACKGROUND_COLOR = '#FFFFFF'; // שימוש ברקע הלבן הראשי

type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

interface Booking {
  _id: string;
  rideGroupId: {
    _id: string;
    groupName: string;
    origin: string;
    destination: string;
    departureTime: string;
  };
  rideDate: string;
  status: BookingStatus;
  pickupLocation?: string;
}

const MyBookings: React.FC = () => {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/api/booking/my-bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(res.data)) {
                setAllBookings(res.data);
            } else {
                setError('Received invalid data format from server.');
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to load your bookings.');
        } finally {
            setLoading(false);
        }
    };
    fetchBookings();
  }, []);
  
  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8000/api/booking/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === bookingId ? { ...booking, status: 'CANCELLED' } : booking
        )
      );
    } catch (err: any) {
      console.error("Failed to cancel booking:", err);
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'ALL') return allBookings;
    return allBookings.filter(booking => booking.status === statusFilter);
  }, [allBookings, statusFilter]);

  const filterOptions: (BookingStatus | 'ALL')[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

  return (
    // --- שינוי: עטיפת העמוד ב-Box עם עיצוב גלובלי תואם ---
    <Box sx={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        {/* --- שינוי: התאמת הכותרת הראשית --- */}
        <Typography variant="h4" fontWeight={700} color={PRIMARY_COLOR} gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          My Ride Bookings
        </Typography>

        {/* --- שינוי: עיצוב מחדש של כפתורי הסינון --- */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <ButtonGroup variant="outlined" aria-label="booking status filter">
            {filterOptions.map(status => (
              <Button
                key={status}
                onClick={() => setStatusFilter(status)}
                variant={statusFilter === status ? 'contained' : 'outlined'}
                sx={
                  statusFilter === status
                    ? {
                        backgroundColor: ACCENT_COLOR,
                        '&:hover': { backgroundColor: '#e85c5c' },
                      }
                    : {
                        borderColor: '#bdc3c7',
                        color: PRIMARY_COLOR,
                      }
                }
              >
                {status}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: ACCENT_COLOR }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        ) : allBookings.length === 0 ? (
          <Alert severity="info" sx={{ mt: 4 }}>You haven't requested any rides yet.</Alert>
        ) : filteredBookings.length === 0 ? (
            <Alert severity="info" sx={{ mt: 4 }}>No bookings match the filter "{statusFilter}".</Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredBookings.map((booking) => (
              // --- שינוי: עיצוב כרטיס ההזמנה (Paper) ---
              <Paper
                key={booking._id} 
                sx={{ p: 4, borderRadius: 4 }}
                elevation={3}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600} color={PRIMARY_COLOR}>
                    {booking.rideGroupId?.groupName || 'Group details missing'}
                  </Typography>
                  <Chip
                    label={booking.status}
                    color={
                      booking.status === 'APPROVED' ? 'success' :
                      booking.status === 'PENDING' ? 'warning' :
                      booking.status === 'REJECTED' ? 'error' : 'default'
                    }
                    size="small"
                  />
                </Box>
                
                {booking.rideGroupId && (
                    <>
                      <Typography variant="body1" sx={{ color: '#444' }}>Route: {booking.rideGroupId.origin} → {booking.rideGroupId.destination}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Departure Time: {booking.rideGroupId.departureTime}</Typography>
                    </>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 'bold' }}>Ride Date: {new Date(booking.rideDate).toLocaleDateString()}</Typography>
                {booking.pickupLocation && (<Typography variant="body2" color="text.secondary">Pickup: {booking.pickupLocation}</Typography>)}

                {booking.status === 'PENDING' && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      // --- שינוי: התאמת צבע כפתור הביטול ---
                      sx={{ 
                        color: ACCENT_COLOR,
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 107, 107, 0.08)'
                        }
                      }}
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Request'}
                    </Button>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MyBookings;