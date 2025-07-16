import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const PRIMARY_BLUE = '#2C3E50';

const AppFooter: React.FC = () => (
  <Box component="footer" sx={{ mt: 'auto', py: 3, backgroundColor: PRIMARY_BLUE }}>
    <Container maxWidth="lg">
      <Typography variant="body2" color="white" align="center">
        © {new Date().getFullYear()} EasyWay. All rights reserved. |{' '}
        <Link to="/signin" style={{ color: 'white', textDecoration: 'underline' }}>
          Admin/Driver Sign In
        </Link>
      </Typography>
    </Container>
  </Box>
);

export default AppFooter;
