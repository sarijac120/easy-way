// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//     Container,
//     Typography,
//     Paper,
//     Box,
//     Chip,
//     Divider,
//     CircularProgress,
//     Alert,
//     Button,
//     Grid 
// } from '@mui/material';
// import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
// import EventRepeatIcon from '@mui/icons-material/EventRepeat';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import CancelIcon from '@mui/icons-material/Cancel';
// import GroupIcon from '@mui/icons-material/Group'; 

// // colors
// const PRIMARY_BLUE = '#2C3E50';
// const PRIMARY_PINK = '#FF6B6B';
// const BACKGROUND_COLOR = '#f7f9fc';

// interface RideGroup {
//     _id: string;
//     groupName: string;
//     origin: string;
//     destination: string;
//     days: string[];
//     time: string;
//     returnTime?: string;
//     capacityTotal: number;
//     passengers: string[];
//     isActive: boolean;
//     groupImageURL?: string;
// }

// const MyGroups: React.FC = () => {
//     const [groups, setGroups] = useState<RideGroup[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [closingGroupId, setClosingGroupId] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchGroups = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const res = await axios.get('http://localhost:8000/api/user/my-groups', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
                
//                 const groupsArray = res.data.data || res.data;
//                 if (!Array.isArray(groupsArray)) {
//                     throw new Error("Data received from server is not an array.");
//                 }

//                 const formattedData = groupsArray.map((group: any) => ({
//                     ...group,
//                     time: group.time || group.departureTime,
//                 }));

//                 setGroups(formattedData);

//             } catch (err: any) {
//                 console.error("Failed to fetch groups:", err);
//                 setError('Error loading your groups. Please try again later.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchGroups();
//     }, []);
    
//     // function for closing group
//     const handleCloseGroup = async (groupId: string) => {
//         if (!groupId) {
//             alert("An internal error occurred. Please refresh the page.");
//             return;
//         }

//         const isConfirmed = window.confirm(
//             'Are you sure you want to close this group? This action is permanent and will remove all passengers.'
//         );

//         if (!isConfirmed) return;
        
//         setClosingGroupId(groupId);
//         try {
//             const token = localStorage.getItem('token');
//             const API_URL = `http://localhost:8000/api/rideGroup/${groupId}/close`;

//             await axios.patch(API_URL, {}, { headers: { Authorization: `Bearer ${token}` } });
            
//             setGroups(prevGroups => 
//                 prevGroups.map(group => 
//                     group._id === groupId ? { ...group, isActive: false } : group
//                 )
//             );

//         } catch (err: any) {
//             const errorMessage = err.response?.data?.error || 'Failed to close the group.';
//             alert(errorMessage);
//         } finally {
//             setClosingGroupId(null);
//         }
//     };

//     const renderGroupCard = (group: RideGroup) => {
//         const isClosing = closingGroupId === group._id;

//         return (
//             <Paper
//                 sx={{
//                     p: 3,
//                     borderRadius: '16px',
//                     border: '1px solid #e0e0e0',
//                     transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//                     '&:hover': {
//                         transform: 'translateY(-4px)',
//                         boxShadow: '0 10px 20px rgba(44, 62, 80, 0.1)',
//                     },
//                     opacity: group.isActive ? 1 : 0.6,
//                     height: '100%',
//                     display: 'flex',
//                     flexDirection: 'column'
//                 }}
//                 elevation={0}
//             >
//                 <Box sx={{ flexGrow: 1 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//                         <Typography variant="h6" fontWeight={700} color={PRIMARY_BLUE}>
//                             {group.groupName}
//                         </Typography>
//                         <Chip
//                             label={group.isActive ? 'Active' : 'Inactive'}
//                             sx={{ bgcolor: group.isActive ? PRIMARY_BLUE : '#e0e0e0', color: group.isActive ? 'white' : '#757575', fontWeight: '600' }}
//                         />
//                     </Box>
                    
//                     <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//                          {group.groupImageURL && (
//                             <Box sx={{ minWidth: 60 }}>
//                                 <img 
//                                     src={group.groupImageURL} 
//                                     alt="Group thumbnail" 
//                                     style={{ width: 60, height: 60, borderRadius: '12px', objectFit: 'cover' }} 
//                                 />
//                             </Box>
//                         )}
//                         <Box>
//                             <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', mb: 1.5 }}>
//                                 <DirectionsCarIcon sx={{ mr: 1.5, color: PRIMARY_PINK, fontSize: '1.2rem' }} />
//                                 <Typography variant="body2">
//                                     <strong>{group.origin}</strong> to <strong>{group.destination}</strong>
//                                 </Typography>
//                             </Box>
//                             <Box sx={{ display: 'flex', alignItems: 'center', color: '#555' }}>
//                                 <AccessTimeIcon sx={{ mr: 1.5, color: PRIMARY_PINK, fontSize: '1.2rem' }} />
//                                 <Typography variant="body2">
//                                     Departure: <strong>{group.time}</strong>
//                                 </Typography>
//                             </Box>
//                         </Box>
//                     </Box>

//                     <Divider sx={{ my: 2 }} />

//                     <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', mb: 1.5 }}>
//                         <EventRepeatIcon sx={{ mr: 1.5, color: PRIMARY_PINK, fontSize: '1.2rem' }} />
//                         <Typography variant="body2">Days: {group.days.join(', ')}</Typography>
//                     </Box>
//                     <Box sx={{ display: 'flex', alignItems: 'center', color: '#555' }}>
//                         <GroupIcon sx={{ mr: 1.5, color: PRIMARY_PINK, fontSize: '1.2rem' }} />
//                         <Typography variant="body2">
//                             Passengers: <strong>{group.passengers.length} / {group.capacityTotal}</strong>
//                         </Typography>
//                     </Box>
//                 </Box>
                
//                 <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
//                     <Button
//                         fullWidth
//                         variant="contained"
//                         color="error"
//                         disabled={!group.isActive || isClosing}
//                         onClick={() => handleCloseGroup(group._id)}
//                         startIcon={!isClosing && <CancelIcon />}
//                         sx={{
//                             backgroundColor: group.isActive ? PRIMARY_PINK : '#BDBDBD',
//                             '&:hover': { backgroundColor: group.isActive ? '#D32F2F' : '#BDBDBD' },
//                             borderRadius: '8px',
//                             textTransform: 'none',
//                             fontWeight: 600,
//                         }}
//                     >
//                         {isClosing ? <CircularProgress size={24} color="inherit" /> : 'Close Group'}
//                     </Button>
//                 </Box>
//             </Paper>
//         );
//     };

//     return (
//         <Container maxWidth="lg" sx={{ mt: 6, pb: 4, minHeight: '100vh', backgroundColor: BACKGROUND_COLOR }}>
//             <Typography variant="h4" fontWeight={700} color={PRIMARY_BLUE} gutterBottom sx={{ textAlign: 'center', mb: 4, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
//                 Groups I Manage
//             </Typography>

//             {loading ? (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
//                     <CircularProgress sx={{ color: PRIMARY_BLUE }} size={50} />
//                 </Box>
//             ) : error ? (
//                 <Alert severity="error">{error}</Alert>
//             ) : groups.length === 0 ? (
//                 <Alert severity="info">You haven't created any groups yet.</Alert>
//             ) : (
//                 <Grid container spacing={3}>
//                     {groups.map((group) => (
//                         <Grid item key={group._id} xs={12} sm={6} md={4}>
//                             {renderGroupCard(group)}
//                         </Grid>
//                     ))}
//                 </Grid>
//             )}
//         </Container>
//     );
// };

// export default MyGroups;













import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Paper,
    Box,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    Button,
    Grid,
    // NEW: Import Dialog components from MUI
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupIcon from '@mui/icons-material/Group';

// colors
const PRIMARY_BLUE = '#2C3E50';
const PRIMARY_PINK = '#FF6B6B';
const BACKGROUND_COLOR = '#f7f9fc';

interface RideGroup {
    _id: string;
    groupName: string;
    origin: string;
    destination: string;
    days: string[];
    time: string;
    returnTime?: string;
    capacityTotal: number;
    passengers: string[];
    isActive: boolean;
    groupImageURL?: string;
}

const MyGroups: React.FC = () => {
    const [groups, setGroups] = useState<RideGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [closingGroupId, setClosingGroupId] = useState<string | null>(null);

    // NEW STATE: For managing the confirmation dialog
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [groupToClose, setGroupToClose] = useState<RideGroup | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8000/api/user/my-groups', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const groupsArray = res.data.data || res.data;
                if (!Array.isArray(groupsArray)) {
                    throw new Error("Data received from server is not an array.");
                }

                const formattedData = groupsArray.map((group: any) => ({
                    ...group,
                    time: group.time || group.departureTime,
                }));

                setGroups(formattedData);

            } catch (err: any) {
                console.error("Failed to fetch groups:", err);
                setError('Error loading your groups. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);
    
    // NEW: Function to open the confirmation dialog
    const handleOpenConfirmDialog = (group: RideGroup) => {
        setGroupToClose(group);
        setConfirmOpen(true);
    };

    // NEW: Function to close the confirmation dialog
    const handleCloseConfirmDialog = () => {
        setGroupToClose(null);
        setConfirmOpen(false);
    };
    
    // UPDATED: This function is now called when the user confirms in the dialog
    const handleConfirmCloseGroup = async () => {
        if (!groupToClose) {
            alert("An internal error occurred. Please refresh the page.");
            return;
        }

        const groupId = groupToClose._id;
        
        setClosingGroupId(groupId);
        handleCloseConfirmDialog(); // Close the dialog
        
        try {
            const token = localStorage.getItem('token');
            const API_URL = `http://localhost:8000/api/rideGroup/${groupId}/close`;

            await axios.patch(API_URL, {}, { headers: { Authorization: `Bearer ${token}` } });
            
            setGroups(prevGroups => 
                prevGroups.map(group => 
                    group._id === groupId ? { ...group, isActive: false } : group
                )
            );

        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to close the group.';
            alert(errorMessage);
        } finally {
            setClosingGroupId(null);
        }
    };

    const renderGroupCard = (group: RideGroup) => {
        const isClosing = closingGroupId === group._id;

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
                    opacity: group.isActive ? 1 : 0.6,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                elevation={0}
            >
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" fontWeight={700} color={PRIMARY_BLUE}>
                            {group.groupName}
                        </Typography>
                        <Chip
                            label={group.isActive ? 'Active' : 'Inactive'}
                            sx={{ bgcolor: group.isActive ? PRIMARY_BLUE : '#e0e0e0', color: group.isActive ? 'white' : '#757575', fontWeight: '600' }}
                        />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                         {group.groupImageURL && (
                            <Box sx={{ minWidth: 60 }}>
                                <img 
                                    src={group.groupImageURL} 
                                    alt="Group thumbnail" 
                                    style={{ width: 60, height: 60, borderRadius: '12px', objectFit: 'cover' }} 
                                />
                            </Box>
                        )}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', mb: 1.5 }}>
                                <DirectionsCarIcon sx={{ mr: 1.5, color: PRIMARY_PINK, fontSize: '1.2rem' }} />
                                <Typography variant="body2">
                                    <strong>{group.origin}</strong> to <strong>{group.destination}</strong>
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                                <AccessTimeIcon sx={{ mr: 1.5, color: PRIMARY_PINK, fontSize: '1.2rem' }} />
                                <Typography variant="body2">
                                    Departure: <strong>{group.time}</strong>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', mb: 1.5 }}>
                        <EventRepeatIcon sx={{ mr: 1.5, color: PRIMARY_PINK, fontSize: '1.2rem' }} />
                        <Typography variant="body2">Days: {group.days.join(', ')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                        <GroupIcon sx={{ mr: 1.5, color: PRIMARY_PINK, fontSize: '1.2rem' }} />
                        <Typography variant="body2">
                            Passengers: <strong>{group.passengers.length} / {group.capacityTotal}</strong>
                        </Typography>
                    </Box>
                </Box>
                
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        disabled={!group.isActive || isClosing}
                        // UPDATED: This now opens the dialog instead of calling the API directly
                        onClick={() => handleOpenConfirmDialog(group)}
                        startIcon={!isClosing && <CancelIcon />}
                        sx={{
                            backgroundColor: group.isActive ? PRIMARY_PINK : '#BDBDBD',
                            '&:hover': { backgroundColor: group.isActive ? '#D32F2F' : '#BDBDBD' },
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        {isClosing ? <CircularProgress size={24} color="inherit" /> : 'Close Group'}
                    </Button>
                </Box>
            </Paper>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 6, pb: 4, minHeight: '100vh', backgroundColor: BACKGROUND_COLOR }}>
            <Typography variant="h4" fontWeight={700} color={PRIMARY_BLUE} gutterBottom sx={{ textAlign: 'center', mb: 4, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                Groups I Manage
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress sx={{ color: PRIMARY_BLUE }} size={50} />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : groups.length === 0 ? (
                <Alert severity="info">You haven't created any groups yet.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {groups.map((group) => (
                        <Grid item key={group._id} xs={12} sm={6} md={4}>
                            {renderGroupCard(group)}
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* NEW: Confirmation Dialog Component */}
            <Dialog
                open={confirmOpen}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ color: PRIMARY_BLUE, fontWeight: 'bold' }}>
                    Confirm Group Closure
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Are you sure you want to permanently close the group "${groupToClose?.groupName}"? This action cannot be undone and will remove all passengers.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: '0 24px 16px' }}>
                    <Button onClick={handleCloseConfirmDialog} sx={{ color: '#555' }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmCloseGroup} 
                        autoFocus
                        variant="contained"
                        color="error"
                        sx={{ backgroundColor: PRIMARY_PINK, '&:hover': { backgroundColor: '#D32F2F' } }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyGroups;