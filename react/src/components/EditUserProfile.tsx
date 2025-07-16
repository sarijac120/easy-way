import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Alert,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PRIMARY_COLOR = '#2C3E50';
const SECONDARY_COLOR = '#ECF0F1';

const EditProfileForm: React.FC = () => {
    const [form, setForm] = useState({ userName: '', email: '' });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8000/api/user/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setForm({
                    userName: res.data.name || '',
                    email: res.data.email || ''
                });
            } catch (err) {
                setMessage({ type: 'error', text: 'download user details failed' });
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.patch('http://localhost:8000/api/user/me', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'profile update succeeded' });
            setTimeout(() => navigate('/profile'), 2000);
        } catch (err) {
            setMessage({ type: 'error', text: 'update failed' });
        }
    };

    return (
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    width: '100%',
                    backgroundColor: 'white',
                    border: `1px solid ${SECONDARY_COLOR}`,
                    textAlign: 'center'
                }}
            >
                <Typography variant="h5" fontWeight={600} color={PRIMARY_COLOR} gutterBottom>
                    Edit Profile
                </Typography>

                {message && <Alert severity={message.type}>{message.text}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} mt={2}>
                        <TextField
                            fullWidth
                            label="full name"
                            name="userName"
                            value={form.userName}
                            onChange={handleChange}
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
                            fullWidth
                            label="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
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
                            sx={{
                                backgroundColor: PRIMARY_COLOR,
                                color: 'white',
                                fontWeight: 600,
                                '&:hover': { backgroundColor: '#1B2B3A' }
                            }}
                        >
                            Save Changes
                        </Button>
                    </Stack>
                </form>
            </Paper>
      )
};

export default EditProfileForm;