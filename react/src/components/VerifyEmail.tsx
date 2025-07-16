import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Alert, CircularProgress, Container } from '@mui/material';

const VerifyEmail: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const navigate = useNavigate();
    useEffect(() => {
        const verify = async () => {
            try {
                await axios.get(`http://localhost:8000/api/user/verify-email/${token}`);
                setStatus('success');
                setTimeout(() => {
                    navigate('/signin');
                }, 3000);

            } catch (err) {
                setStatus('error');
            }
        };

        verify();
    }, [token]);

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            {status === 'loading' && <CircularProgress />}
            {status === 'success' && (
                <Alert severity="success">Your email has been verified successfully!
                </Alert>
            )}
            {status === 'error' && (
                <Alert severity="error">Verification failed or link expired.</Alert>
            )}
        </Container>
    );
};

export default VerifyEmail;
