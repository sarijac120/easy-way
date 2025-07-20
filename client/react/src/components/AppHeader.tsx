import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { logout } from '../store/authSlice';

const BLUE_COLOR = '#2C3E50';
const PINK_COLOR = '#FF6B6B';

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('agrredToGroupTerm', ("false").toString());
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="fixed" sx={{ backgroundColor: BLUE_COLOR }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {/* תוכל לשים כאן לוגו בעתיד */}
          EasyWay {user && user.userName ? `- ${user.userName}` : ''}
        </Typography>
        <Button
          sx={{ color: isActive('/') ? PINK_COLOR : '#FFFFFF' }}
          onClick={() => navigate('/')}>
          Home
        </Button>
        <Button
          sx={{ color: isActive('/profile') ? PINK_COLOR : '#FFFFFF' }}
          onClick={() => navigate('/profile')}>
          My Profile
        </Button>
        <Button
          sx={{ color: isActive('/dashboardPage') ||isActive('/dashboardPage/requests') ||isActive('/dashboardPage/my')||isActive('/dashboardPage/my-joined-groups')||isActive('/dashboardPage/bookings')||isActive('/dashboardPage/all')||isActive('/dashboardPage/create')? PINK_COLOR : '#FFFFFF' }}
          onClick={() => navigate('/dashboardPage')}>
          Dashboard
        </Button>
        {user && user.role === 'ADMIN' && (
          <Button
            sx={{ color: isActive('/admin') ? PINK_COLOR : '#FFFFFF' }}
            onClick={() => navigate('/admin')}>
            Management
          </Button>
        )}
        {!user ? (
          <Button
            sx={{ color: isActive('/signin-signup') ||isActive('/signin')||isActive('/register')? PINK_COLOR : '#FFFFFF', backgroundColor: BLUE_COLOR, '&:hover': { backgroundColor: BLUE_COLOR } }}
            onClick={() => navigate('/signin-signup')}>
            Sign In / Sign Up
          </Button>
        ) : (
          <Button
            sx={{ backgroundColor: BLUE_COLOR, color: '#FFFFFF', '&:hover': { backgroundColor: BLUE_COLOR } }}
            onClick={handleLogout}>
            Log Out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
