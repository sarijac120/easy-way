import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box
} from '@mui/material';

const CreateGroup: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [time, setTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [capacityTotal, setCapacityTotal] = useState<number>(4);
  const [estimatedDuration, setEstimatedDuration] = useState<number>(60);
  const [carImage, setCarImage] = useState<File | null>(null);

  const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  const handleDayToggle = (day: string) => {
    setDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCarImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (days.length === 0) {
      alert('Please select at least one day for the ride.');
      return;
    }
    if (!groupName) {
      alert('Please enter a group name.');
      return;
    }
    if (!capacityTotal || capacityTotal < 1 || capacityTotal > 20) {
      alert('Capacity must be between 1 and 20.');
      return;
    }
    if (!estimatedDuration || estimatedDuration < 1 || estimatedDuration > 300) {
      alert('Estimated duration must be between 1 and 300 minutes.');
      return;
    }
    const dataToSend = new FormData();
    dataToSend.append('groupName', groupName);
    dataToSend.append('origin', origin);
    dataToSend.append('destination', destination);
    dataToSend.append('departureTime', time);
    dataToSend.append('returnTime', returnTime);
    dataToSend.append('capacityTotal', capacityTotal.toString());
    dataToSend.append('estimatedDuration', estimatedDuration.toString());
    dataToSend.append('days', JSON.stringify(days));
    if (carImage) {
      dataToSend.append('groupImage', carImage);
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/rideGroup/', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        setSuccess(true);
        setGroupName('');
        setOrigin('');
        setDestination('');
        setTime('');
        setReturnTime('');
        setDays([]);
        setCapacityTotal(4);
        setEstimatedDuration(60);
        setCarImage(null);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Group creation failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating group');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Create New Ride Group
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Group created successfully!
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Group Name"
          fullWidth
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          margin="normal"
          required
          sx={{ '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
        />
        <TextField
          label="Origin (City)"
          fullWidth
          value={origin}
          onChange={e => setOrigin(e.target.value)}
          margin="normal"
          required
          sx={{ '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
        />
        <TextField
          label="Destination"
          fullWidth
          value={destination}
          onChange={e => setDestination(e.target.value)}
          margin="normal"
          required
          sx={{ '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
        />
        <TextField
          label="Departure Time"
          type="time"
          fullWidth
          value={time}
          onChange={e => setTime(e.target.value)}
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
          sx={{ '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
        />
        <TextField
          label="Return Time (optional)"
          type="time"
          fullWidth
          value={returnTime}
          onChange={e => setReturnTime(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          sx={{ '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
        />
        <TextField
          label="Total Seats (1-20)"
          type="number"
          fullWidth
          value={capacityTotal}
          onChange={e => setCapacityTotal(Number(e.target.value))}
          margin="normal"
          required
          inputProps={{ min: 1, max: 20 }}
          sx={{ '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
        />
        <TextField
          label="Estimated Duration (minutes, 1-300)"
          type="number"
          fullWidth
          value={estimatedDuration}
          onChange={e => setEstimatedDuration(Number(e.target.value))}
          margin="normal"
          required
          inputProps={{ min: 1, max: 300 }}
          sx={{ '& label': { color: '#FF6B6B' }, '& label.Mui-focused': { color: '#FF6B6B' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF6B6B' }, '&:hover fieldset': { borderColor: '#FF6B6B' }, '&.Mui-focused fieldset': { borderColor: '#FF6B6B' } } }}
        />
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{
            mt: 2,
            borderColor: '#FF6B6B',
            color: '#FF6B6B',
            '&:hover': {
              borderColor: '#FF6B6B',
              backgroundColor: 'rgba(255, 107, 107, 0.05)'
            }
          }}
        >
          {carImage ? `File selected: ${carImage.name}` : 'Upload Car Image (Optional)'}
          <input
            type="file"
            hidden
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />
        </Button>
        <Box sx={{ my: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#2C3E50', opacity: 0.9, mb: 2 }}>
            Days of the Week:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {allDays.map(day => (
              <Button
                key={day}
                onClick={() => handleDayToggle(day)}
                sx={{
                  px: 1.5,
                  py: 0.75,
                  fontSize: '0.8rem',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  transition: 'all 250ms',
                  transform: 'scale(1)',
                  color: days.includes(day) ? 'white' : '#FF8C8C',
                  border: days.includes(day) ? '2px solid #2C3E50' : '2px solid #FF8C8C',
                  bgcolor: days.includes(day) ? '#2C3E50' : 'transparent',
                  boxShadow: days.includes(day)
                    ? '0 8px 20px rgba(44, 62, 80, 0.2)'
                    : '0 3px 8px rgba(255, 140, 140, 0.1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    bgcolor: days.includes(day) ? '#34495E' : 'rgba(255, 140, 140, 0.1)',
                    borderColor: days.includes(day) ? '#34495E' : '#FF8C8C',
                    color: days.includes(day) ? 'white' : '#FF8C8C',
                  }
                }}
              >
                {day}
              </Button>
            ))}
          </Box>
        </Box>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            bgcolor: '#2C3E50',
            '&:hover': {
              bgcolor: '#34495E'
            }
          }}
        >
          Create Group
        </Button>
      </Box>
    </Container>
  );
};

export default CreateGroup;