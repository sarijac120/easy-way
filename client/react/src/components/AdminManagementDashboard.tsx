import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Button,
  ButtonGroup,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';

const PRIMARY_COLOR = '#2C3E50';
const BACKGROUND_COLOR = '#FFFFFF';

const filterOptions = {
  users: [
    { label: 'All', value: '' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Driver', value: 'DRIVER' },
    { label: 'Passenger', value: 'PASSENGER' },
  ],
  bookings: [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ],
  groups: [
    { label: 'All', value: '' },
  ],
};

const AdminManagementDashboard: React.FC = () => {
  const [view, setView] = useState<'users' | 'bookings' | 'groups'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    setError(null);
    setLoading(true);
    const fetchData = async () => {
      try {
        if (view === 'users') {
          const res = await axios.get('http://localhost:8000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(res.data.data || []);
        } else if (view === 'bookings') {
          const res = await axios.get('http://localhost:8000/api/admin/bookings', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBookings(res.data.data || []);
        } else if (view === 'groups') {
          const res = await axios.get('http://localhost:8000/api/admin/groups', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setGroups(res.data.data || []);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [view, token]);

  // Filtering logic
  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (userRoleFilter) filtered = filtered.filter((u: any) => u.role === userRoleFilter);
    if (search) filtered = filtered.filter((u: any) => u.userName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
    return filtered;
  }, [users, userRoleFilter, search]);

  const filteredBookings = useMemo(() => {
    let filtered = bookings;
    if (bookingStatusFilter) filtered = filtered.filter((b: any) => b.status === bookingStatusFilter);
    return filtered;
  }, [bookings, bookingStatusFilter]);

  // Renderers
  const renderUsersTable = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderBookingsTable = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Passenger</TableCell>
            <TableCell>Group</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ride Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell>{booking.passengerId?.userName || 'N/A'}</TableCell>
              <TableCell>{booking.rideGroupId?.groupName || 'N/A'}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>{new Date(booking.rideDate).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderGroupsTable = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Group Name</TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Driver</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group._id}>
              <TableCell>{group.groupName}</TableCell>
              <TableCell>{group.origin}</TableCell>
              <TableCell>{group.destination}</TableCell>
              <TableCell>{group.driverId?.userName || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ backgroundColor: BACKGROUND_COLOR, minHeight: '80vh', py: 4, borderRadius: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} color={PRIMARY_COLOR} gutterBottom sx={{ mb: 3 }}>
          Admin Management Dashboard
        </Typography>
        <ButtonGroup sx={{ mb: 2 }}>
          <Button
            variant={view === 'users' ? 'contained' : 'outlined'}
            onClick={() => setView('users')}
            sx={{ fontWeight: 600, backgroundColor: view === 'users' ? PRIMARY_COLOR : undefined, color: view === 'users' ? '#fff' : PRIMARY_COLOR }}
          >
            Users
          </Button>
          <Button
            variant={view === 'bookings' ? 'contained' : 'outlined'}
            onClick={() => setView('bookings')}
            sx={{ fontWeight: 600, backgroundColor: view === 'bookings' ? PRIMARY_COLOR : undefined, color: view === 'bookings' ? '#fff' : PRIMARY_COLOR }}
          >
            Join Requests
          </Button>
          <Button
            variant={view === 'groups' ? 'contained' : 'outlined'}
            onClick={() => setView('groups')}
            sx={{ fontWeight: 600, backgroundColor: view === 'groups' ? PRIMARY_COLOR : undefined, color: view === 'groups' ? '#fff' : PRIMARY_COLOR }}
          >
            Travel Groups
          </Button>
        </ButtonGroup>
        <Divider sx={{ mb: 2 }} />
        {/* Filters */}
        {view === 'users' && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={userRoleFilter}
                label="Role"
                onChange={e => setUserRoleFilter(e.target.value)}
              >
                {filterOptions.users.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Name or Email"
            />
          </Box>
        )}
        {view === 'bookings' && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={bookingStatusFilter}
                label="Status"
                onChange={e => setBookingStatusFilter(e.target.value)}
              >
                {filterOptions.bookings.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        {/* Data Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: PRIMARY_COLOR }} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {view === 'users' && renderUsersTable()}
            {view === 'bookings' && renderBookingsTable()}
            {view === 'groups' && renderGroupsTable()}
          </>
        )}
      </Container>
    </Box>
  );
};

export default AdminManagementDashboard;
