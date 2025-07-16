import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';

import RequestCard from './requestCard';

const PRIMARY_BLUE = '#2C3E50';
const BACKGROUND_COLOR = '#f7f9fc';

export interface PendingRequest {
  _id: string;
  rideGroupId: {
    _id: string;
    groupName: string;
  };
  passengerId: {
    _id: string;
    userName: string;
  };
  seatsRequested: number;
  pickupLocation: string;
  status: 'PENDING';
  createdAt: string;
}

const PendingRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const { data } = await axios.get<PendingRequest[]>(
          'http://localhost:8000/api/booking/driver/pending',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch pending requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleRequestHandled = useCallback((bookingId: string) => {
    setRequests(prev => prev.filter(req => req._id !== bookingId));
  }, []);

  return (
    <Container 
        maxWidth="md" 
        sx={{ 
            mt: 6, 
            pb: 4, 
            minHeight: '100vh', 
            backgroundColor: BACKGROUND_COLOR 
        }}
    >
        <Typography 
            variant="h4" 
            fontWeight={700} 
            color={PRIMARY_BLUE} 
            gutterBottom 
            sx={{ 
                textAlign: 'center', 
                mb: 4, 
                pb: 2, 
                borderBottom: '1px solid #e0e0e0' 
            }}
        >
            Pending Join Requests
        </Typography>

        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress sx={{ color: PRIMARY_BLUE }} size={50} />
            </Box>
        ) : error ? (
            <Alert severity="error" sx={{ borderRadius: 2, boxShadow: 1 }}>
                {error}
            </Alert>
        ) : requests.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2, boxShadow: 1 }}>
                You have no pending requests at the moment.
            </Alert>
        ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {requests.map(request => (
                    <RequestCard
                        key={request._id}
                        request={request}
                        onRequestHandled={handleRequestHandled}
                    />
                ))}
            </Box>
        )}
    </Container>
  );
};

export default PendingRequestsPage;