import React, { useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Avatar,
  Button,
  Alert,
  Container,
  Paper,
  Stack
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setUser, logout } from '../store/authSlice';

const PRIMARY_COLOR = '#2C3E50';
const SECONDARY_COLOR = '#ECF0F1';
const ACCENT_COLOR = '#2c3e50';
const YELLO_COLOR = '#FF6B6B';

type UserOverviewProps = {
  setView: (view: 'overview' | 'edit' | 'changePassword') => void;
};

const UserOverview: React.FC<UserOverviewProps> = ({ setView }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!(user && user.token);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');

        const res = await axios.get('http://localhost:8000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        dispatch(setUser({
          token,
          userName: res.data.userName,
          role: res.data.role,
          email: res.data.email,
          avatarUrl: res.data.avatarUrl || ''
        }));
      } catch (err: any) {
        console.error('Error fetching user:', err.response || err.message || err);
        dispatch(logout());
      }
    };

    if (!user || !user.userName) fetchUser();
  }, [dispatch, user.userName]);

  if (!isLoggedIn) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 10 }}>Not logged in</Alert>
      </Container>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 4,
        width: '100%',
        backgroundColor: 'white',
        border: `1px solid ${SECONDARY_COLOR}`
      }}
    >
      <Avatar
        src={user && user.avatarUrl ? user.avatarUrl : ''}
        sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
      />
      <Typography variant="h5" fontWeight={600} color={PRIMARY_COLOR} textAlign="center">
        Hello{user && user.userName ? `, ${user.userName}` : ''}
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center">
        {user && user.email ? user.email : ''}
      </Typography>

      <Stack direction="column" spacing={2} mt={4}>
        <Button
          variant="outlined"
          sx={{
            color: YELLO_COLOR,
            borderColor: YELLO_COLOR,
            fontWeight: 600,
            '&:hover': { backgroundColor: SECONDARY_COLOR }
          }}
          onClick={() => setView('edit')}
        >
          Edit Profile
        </Button>

        <Button
          variant="outlined"
          sx={{
            color: YELLO_COLOR,
            borderColor: YELLO_COLOR,
            fontWeight: 600,
            '&:hover': { backgroundColor: SECONDARY_COLOR }
          }}
          onClick={() => setView('changePassword')}
        >
          Change Password
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: ACCENT_COLOR,
            color: 'white',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#2c3e50' }
          }}
          onClick={() => {
            localStorage.removeItem('token');
            dispatch(logout());
            window.location.href = '/';
          }}
        >
          Log Out
        </Button>
      </Stack>
    </Paper>
  );
};

export default UserOverview;
