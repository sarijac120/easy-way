import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Paper,
    Box,
    Divider,
    CircularProgress,
    Alert,
    Grid,
    Button 
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; 

const BLUE_COLOR = '#2C3E50';
const PINK_COLOR = '#FF6B6B';
const BACKGROUND_COLOR = '#f7f9fc';

interface RideGroup {
  _id: string;
  groupName: string;
  origin: string;
  destination:string;
  time: string;
}

interface JoinedGroupData {
  _id: string;
  rideDate: string;
  groupId: RideGroup;
}

const MyJoinedGroups: React.FC = () => {
  const [joinedGroups, setJoinedGroups] = useState<JoinedGroupData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [leavingGroupId, setLeavingGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found. Please log in.');

        const API_URL = 'http://localhost:8000/api/user/my-joined-groups';
        const response = await axios.get(API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const formattedData = response.data.data.joinedGroups.map((group: any) => ({
            ...group,
            groupId: {
                ...group.groupId,
                time: group.groupId.time || group.groupId.departureTime,
            }
        }));

        setJoinedGroups(formattedData);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyGroups();
  }, []);
//function leave a group  
  const handleLeaveGroup = async (groupId: string) => {
    setLeavingGroupId(groupId); 
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Your session has expired. Please log in again.');
            return;
        }
        const API_URL = `http://localhost:8000/api/rideGroup/${groupId}/leave`;
        await axios.post(
            API_URL, 
            {},
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        //update the local state to remove the group from the view without needing to reload the page
        setJoinedGroups(prevGroups => prevGroups.filter(g => g.groupId._id !== groupId));

    } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Failed to leave the group. Please try again.';
        alert(errorMessage); 
    } finally {
        setLeavingGroupId(null);
    }
  };


   // a button in the group cards to allow ext from group
  const renderJoinedGroupCard = (joinedGroup: JoinedGroupData) => {
    const isLeaving = leavingGroupId === joinedGroup.groupId._id;

    return (
        <Paper
            key={joinedGroup._id}
            sx={{
                p: 3,
                borderRadius: '16px',
                border: '1px solid #e0e0e0',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 20px rgba(44, 62, 80, 0.1)',
                },
                height: '100%',
                display: 'flex', 
                flexDirection: 'column'
            }}
            elevation={0}
        >
            <Box sx={{ flexGrow: 1 }}> 
                <Typography variant="h6" fontWeight={700} color={BLUE_COLOR}>
                    {joinedGroup.groupId.groupName}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', mb: 1.5 }}>
                    <DirectionsCarIcon sx={{ mr: 1.5, color: PINK_COLOR }} />
                    <Typography variant="body1">
                        From <strong>{joinedGroup.groupId.origin}</strong> to <strong>{joinedGroup.groupId.destination}</strong>
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', mb: 1.5 }}>
                    <AccessTimeIcon sx={{ mr: 1.5, color: PINK_COLOR }} />
                    <Typography variant="body1">
                        Departure Time: <strong>{joinedGroup.groupId.time}</strong>
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                    <CalendarTodayIcon sx={{ mr: 1.5, color: PINK_COLOR }} />
                    <Typography variant="body1">
                        Date: <strong>{new Date(joinedGroup.rideDate).toLocaleDateString('en-GB')}</strong>
                    </Typography>
                </Box>
            </Box>
            
            {/* the button in the cards*/}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    disabled={isLeaving} 
                    onClick={() => handleLeaveGroup(joinedGroup.groupId._id)}
                    startIcon={!isLeaving && <ExitToAppIcon />}
                    sx={{
                        backgroundColor: PINK_COLOR,
                        '&:hover': { backgroundColor: '#E55B5B' },
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                    }}
                >
                    {isLeaving ? <CircularProgress size={24} color="inherit" /> : 'Leave Group'}
                </Button>
            </Box>
        </Paper>
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 6, pb: 4, minHeight: '100vh', backgroundColor: BACKGROUND_COLOR }}>
        <Typography variant="h4" fontWeight={700} color={BLUE_COLOR} gutterBottom sx={{ textAlign: 'center', mb: 4, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
            Groups I've Joined
        </Typography>

        {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress sx={{ color: BLUE_COLOR }} size={50} />
            </Box>
        ) : error ? (
            <Alert severity="error" sx={{ borderRadius: 2, boxShadow: 1 }}>{error}</Alert>
        ) : joinedGroups.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2, boxShadow: 1 }}>You haven't joined any groups yet.</Alert>
        ) : (
            <Grid container spacing={3}>
                {joinedGroups.map((group) => (
                    <Grid item key={group._id} xs={12} sm={6} md={4}>
                        {renderJoinedGroupCard(group)}
                    </Grid>
                ))}
            </Grid>
        )}
    </Container>
  );
};

export default MyJoinedGroups;