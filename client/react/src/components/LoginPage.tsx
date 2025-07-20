import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PRIMARY_COLOR = '#2C3E50';
const ACCENT_COLOR = '#FF6B6B';
const BACKGROUND_COLOR = '#FFFFFF';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: PRIMARY_COLOR }}>
            EasyWay
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: PRIMARY_COLOR, mb: 4 }}>
            Find your regular ride group easily and reliably.
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, color: '#444' }}>
            Join a group, save money, and travel smarter. Sign up or log in to get started!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: ACCENT_COLOR,
                color: ACCENT_COLOR,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#FFE415',
                  backgroundColor: '#E5F7F5'
                }
              }}
              onClick={() => navigate('/register')}
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: ACCENT_COLOR,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#e85c5c'
                }
              }}
              onClick={() => navigate('/signin')}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
