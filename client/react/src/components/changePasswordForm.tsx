import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Alert,
    Typography,
    Paper
} from '@mui/material';

const ACCENT_COLOR = '#2c3e50';

const ChangePasswordForm: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            return setMessage({ type: 'error', text: 'New passwords do not match.' });
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.patch(
                'http://localhost:4000/api/user/change-password',
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ type: 'success', text: 'Password updated successfully.' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ maxWidth: 500, margin: 'auto', mt: 6, p: 4 }}>
            <Typography variant="h5" gutterBottom>Change Password</Typography>
            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    sx={{
                        '& label': {
                            color: '#FF6B6B',
                        },
                        '& label.Mui-focused': {
                            color: '#FF6B6B',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#FF6B6B',
                            },
                            '&:hover fieldset': {
                                borderColor: '#FF6B6B',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#FF6B6B',
                            },
                        }
                    }}

                />
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    sx={{
                        '& label': {
                            color: '#FF6B6B',
                        },
                        '& label.Mui-focused': {
                            color: '#FF6B6B',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#FF6B6B',
                            },
                            '&:hover fieldset': {
                                borderColor: '#FF6B6B',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#FF6B6B',
                            },
                        }
                    }}

                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    sx={{
                        '& label': {
                            color: '#FF6B6B',
                        },
                        '& label.Mui-focused': {
                            color: '#FF6B6B',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#FF6B6B',
                            },
                            '&:hover fieldset': {
                                borderColor: '#FF6B6B',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#FF6B6B',
                            },
                        }
                    }}

                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: ACCENT_COLOR }}
                    disabled={loading}
                    fullWidth
                >
                    {loading ? 'Saving...' : 'Update Password'}
                </Button>
            </form>
        </Paper>
    );
};

export default ChangePasswordForm;
