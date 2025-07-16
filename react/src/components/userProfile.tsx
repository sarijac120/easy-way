import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Alert,
  Container,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setUser, logout } from '../store/authSlice';
import EditProfileForm from './EditUserProfile';
import ChangePasswordForm from './changePasswordForm';
import UserOverview from './userOverview';

const BACKGROUND_COLOR = '#FDFDFD';

type ViewState = 'overview' | 'edit' | 'changePassword';

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!(user && user.token);
  const [view, setView] = useState<ViewState>('overview');

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
  }, [dispatch, user]);

  if (!isLoggedIn) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 10 }}>Not logged in</Alert>
      </Container>
    );
  }

  const renderContent = () => {
    switch (view) {
      case 'edit':
        return <EditProfileForm />;
      case 'changePassword':
        return <ChangePasswordForm />;
      default:
        return <UserOverview setView={setView} />;
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: BACKGROUND_COLOR,
        py: 4
      }}
    >
      <Box mt={4}>
        {renderContent()}
      </Box>
    </Container>
  );
};

export default UserProfile;
