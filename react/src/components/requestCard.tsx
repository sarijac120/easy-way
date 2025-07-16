
import React, { useState } from 'react';
import axios from 'axios';
import {
    Paper,
    Typography,
    Box,
    Button,
    CircularProgress,
    Divider,
    Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ChairIcon from '@mui/icons-material/Chair';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import type { PendingRequest } from './pendingRequest';

const PRIMARY_BLUE = '#2C3E50';
const PRIMARY_PINK = '#FF6B6B';

interface RequestCardProps {
  request: PendingRequest;
  onRequestHandled: (bookingId: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onRequestHandled }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateStatus = async (status: 'APPROVED' | 'REJECTED') => {
    setIsProcessing(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8000/api/booking/${request._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRequestHandled(request._id);
    } catch (err: any) {
      setError(err.response?.data?.message || `Could not ${status.toLowerCase()} the request.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Paper
        sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid #e0e0e0',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 20px rgba(44, 62, 80, 0.1)',
            },
        }}
        elevation={0}
    >
        <Typography variant="h6" fontWeight={700} color={PRIMARY_BLUE}>
            Request for: {request.rideGroupId?.groupName || 'N/A'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', mb: 1.5 }}>
            <PersonIcon sx={{ mr: 1.5, color: PRIMARY_PINK }} />
            <Typography variant="body1">
                Passenger: <strong>{request.passengerId?.userName || 'N/A'}</strong>
            </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', mb: 1.5 }}>
            <ChairIcon sx={{ mr: 1.5, color: PRIMARY_PINK }} />
            <Typography variant="body1">
                Seats Requested: <strong>{request.seatsRequested}</strong>
            </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', color: '#555' }}>
            <LocationOnIcon sx={{ mr: 1.5, color: PRIMARY_PINK }} />
            <Typography variant="body1">
                Pickup: <strong>{request.pickupLocation}</strong>
            </Typography>
        </Box>

        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f0f0f0' }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleUpdateStatus('REJECTED')}
                    disabled={isProcessing}
                    sx={{ borderRadius: '8px' }}
                >
                    Reject
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ 
                        backgroundColor: PRIMARY_BLUE, 
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: '#1A242F' }
                    }}
                    onClick={() => handleUpdateStatus('APPROVED')}
                    disabled={isProcessing}
                >
                    {isProcessing ? <CircularProgress size={24} color="inherit" /> : 'Approve'}
                </Button>
            </Box>
        </Box>
    </Paper>
  );
};

export default RequestCard;