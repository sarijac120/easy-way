import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, Paper } from '@mui/material';
import { useAppSelector } from '../hooks/reduxHooks';

const PRIMARY_COLOR = '#2C3E50'; 
const ACCENT_COLOR = '#FF6B6B';
const BACKGROUND_COLOR = '#FFFFFF';

const inactiveButtonSx = {
  color: ACCENT_COLOR,
  borderColor: ACCENT_COLOR,
  '&:hover': {
    backgroundColor: 'rgba(255, 107, 107, 0.08)', 
    borderColor: ACCENT_COLOR,
  },
};

// style for Active Button
const activeButtonSx = {
  backgroundColor: PRIMARY_COLOR,
  color: '#FFFFFF',
  borderColor: PRIMARY_COLOR, 
  '&:hover': {
    backgroundColor: '#1A252F', 
  },
};


const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector(state => state.auth.user);
  const activePath = location.pathname.split('/').pop();

  const buttonStyles = {
    fontWeight: 600,
    px: 3,
    py: 1,
  };
  
  const getButtonProps = (path: string) => ({
    variant: activePath === path ? 'contained' : 'outlined' as 'contained' | 'outlined',
    sx: {
      ...buttonStyles,
      ...inactiveButtonSx,
      ...(activePath === path && activeButtonSx),
    },
  });

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 6 }, backgroundColor: BACKGROUND_COLOR }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>          
          <Button onClick={() => navigate('create')} {...getButtonProps('create')}>
            Create Group
          </Button>
          
          <Button onClick={() => navigate('all')} {...getButtonProps('all')}>
            All Groups
          </Button>
          
          <Button onClick={() => navigate('bookings')} {...getButtonProps('bookings')}>
            My Bookings
          </Button>

          <Button onClick={() => navigate('my-joined-groups')} {...getButtonProps('my-joined-groups')}>
            Joined Groups
          </Button>

          {user && user.role === 'DRIVER' && (
            <>
              <Button onClick={() => navigate('my')} {...getButtonProps('my')}>
                Menagment Groups
              </Button>
              
              <Button onClick={() => navigate('requests')} {...getButtonProps('requests')}>
                Pending Requests
              </Button>
            </>
          )}
        </Box>

        <Paper elevation={3} sx={{ borderRadius: 4, p: { xs: 2, sm: 3, md: 4 }, mt: 4 }}>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardPage;