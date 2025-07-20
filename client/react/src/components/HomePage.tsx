import React from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    Fade,
    Grow,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Color palette
const theme = {
    primary: {
        blue: '#2C3E50',
        blueDark: '#1A242F',
        blueLight: '#34495E',
    },
    secondary: {
        pink: '#FF6B6B',
        pinkLight: '#FF8E8E',
    },
    background: {
        main: '#FFFFFF',
        light: '#F8FAFC',
        card: '#FFFFFF',
    },
    text: {
        primary: '#2C3E50',
        secondary: '#64748B',
        light: '#94A3B8',
    },
    border: '#E2E8F0',
};

const features = [
    {
        icon: <DirectionsCarIcon />,
        title: 'Find & Join Groups',
        description: 'Easily search for existing ride groups based on your origin, destination, and schedule.',
        color: '#3B82F6',
        bgColor: '#EFF6FF',
    },
    {
        icon: <GroupIcon />,
        title: 'Create & Manage',
        description: 'Start your own ride group, set the capacity, and manage member requests with a simple interface.',
        color: '#10B981',
        bgColor: '#F0FDF4',
    },
    {
        icon: <AddTaskIcon />,
        title: 'Hassle-Free Bookings',
        description: 'Request to join rides, track the status of your bookings, and manage your upcoming trips all in one place.',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
    }
];

const benefits = [
    'Save money on transportation costs',
    'Reduce your carbon footprint',
    'Meet new people and build connections',
    'Enjoy a more comfortable commute',
];

const HomePage: React.FC = () => {
    return (
        <Box sx={{ backgroundColor: theme.background.main, minHeight: '100vh' }}>
            {/* Hero Section */}
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        pt: { xs: 6, md: 10 },
                        pb: { xs: 8, md: 12 },
                        position: 'relative',
                    }}
                >
                    {/* Background decoration */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100%',
                            height: '100%',
                            background: `radial-gradient(circle at 50% 20%, ${theme.secondary.pink}08 0%, transparent 50%)`,
                            zIndex: 0,
                        }}
                    />
                    
                    <Fade in timeout={1000}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box
                                component="img"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Blue_Glass_Arrow.svg/2560px-Blue_Glass_Arrow.svg.png"
                                alt="EasyWay Logo"
                                sx={{
                                    width: 'auto',
                                    height: { xs: '120px', md: '180px' },
                                    mb: 4,
                                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                                }}
                            />
                            
                            <Typography
                                variant="h1"
                                component="h1"
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                                    fontWeight: 800,
                                    color: theme.primary.blue,
                                    mb: 2,
                                    background: `linear-gradient(135deg, ${theme.primary.blue} 0%, ${theme.primary.blueLight} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Welcome to EasyWay
                            </Typography>
                            
                            <Typography
                                variant="h5"
                                component="p"
                                sx={{
                                    color: theme.text.secondary,
                                    mb: 4,
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                                    lineHeight: 1.6,
                                }}
                            >
                                Your all-in-one platform for ride sharing, group management, and hassle-free bookings.
                            </Typography>
                            
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    gap: 2, 
                                    flexWrap: 'wrap',
                                    mb: 6,
                                }}
                            >
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        bgcolor: theme.primary.blue,
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        boxShadow: '0 4px 14px rgba(44, 62, 80, 0.3)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: theme.primary.blueDark,
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 20px rgba(44, 62, 80, 0.4)',
                                        },
                                    }}
                                >
                                    Get Started
                                </Button>
                                <Button
                                    component={Link}
                                    to="/dashboardPage/all"
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: theme.primary.blue,
                                        color: theme.primary.blue,
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        borderWidth: '2px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: theme.primary.blue,
                                            backgroundColor: theme.primary.blue,
                                            color: 'white',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    Explore Groups
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                </Box>
            </Container>

            {/* Benefits Section */}
            <Box sx={{ py: 8, backgroundColor: theme.background.light }}>
                <Container maxWidth="lg">
                    <Typography 
                        variant="h4" 
                        component="h2" 
                        sx={{
                            fontWeight: 700,
                            color: theme.primary.blue,
                            textAlign: 'center',
                            mb: 6,
                            fontSize: { xs: '2rem', md: '2.5rem' },
                        }}
                    >
                        Why Choose EasyWay?
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {benefits.map((benefit, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Grow in timeout={1000 + index * 200}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: '12px',
                                            backgroundColor: theme.background.card,
                                            border: `1px solid ${theme.border}`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                            },
                                        }}
                                    >
                                        <CheckCircleIcon 
                                            sx={{ 
                                                color: theme.secondary.pink,
                                                fontSize: '1.5rem',
                                                flexShrink: 0,
                                            }} 
                                        />
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                color: theme.text.primary,
                                                fontWeight: 500,
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            {benefit}
                                        </Typography>
                                    </Box>
                                </Grow>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 10, backgroundColor: theme.background.main }}>
                <Container maxWidth="lg">
                    <Typography 
                        variant="h4" 
                        component="h2" 
                        sx={{
                            fontWeight: 700,
                            color: theme.primary.blue,
                            textAlign: 'center',
                            mb: 2,
                            fontSize: { xs: '2rem', md: '2.5rem' },
                        }}
                    >
                        Everything You Need
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{
                            color: theme.text.secondary,
                            textAlign: 'center',
                            mb: 8,
                            maxWidth: '600px',
                            mx: 'auto',
                        }}
                    >
                        Discover the powerful features that make ride sharing simple and efficient
                    </Typography>
                    
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Grow in timeout={1200 + index * 300}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            borderRadius: '20px',
                                            border: `1px solid ${theme.border}`,
                                            transition: 'all 0.4s ease',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                                borderColor: feature.color,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '20px',
                                                    backgroundColor: feature.bgColor,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mx: 'auto',
                                                    mb: 3,
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        color: feature.color,
                                                        fontSize: '2rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {feature.icon}
                                                </Box>
                                            </Box>
                                            
                                            <Typography 
                                                variant="h6" 
                                                component="h3"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: theme.text.primary,
                                                    mb: 2,
                                                    fontSize: '1.25rem',
                                                }}
                                            >
                                                {feature.title}
                                            </Typography>
                                            
                                            <Typography 
                                                variant="body1"
                                                sx={{
                                                    color: theme.text.secondary,
                                                    lineHeight: 1.6,
                                                    fontSize: '0.95rem',
                                                }}
                                            >
                                                {feature.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grow>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Call to Action Section */}
            <Box 
                sx={{ 
                    py: 10, 
                    backgroundColor: theme.primary.blue,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background decoration */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '50%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${theme.secondary.pink}20 0%, transparent 100%)`,
                        zIndex: 0,
                    }}
                />
                
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography 
                            variant="h4" 
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                color: 'white',
                                mb: 3,
                                fontSize: { xs: '2rem', md: '2.5rem' },
                            }}
                        >
                            Ready to Start Your Journey?
                        </Typography>
                        
                        <Typography 
                            variant="h6"
                            sx={{
                                color: 'rgba(255,255,255,0.9)',
                                mb: 4,
                                maxWidth: '500px',
                                mx: 'auto',
                            }}
                        >
                            Join thousands of users who are already saving money and reducing their environmental impact
                        </Typography>
                        
                        <Button
                            component={Link}
                            to="/register"
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                bgcolor: 'white',
                                color: theme.primary.blue,
                                px: 5,
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                borderRadius: '12px',
                                textTransform: 'none',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.95)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                },
                            }}
                        >
                            Join EasyWay Today
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;