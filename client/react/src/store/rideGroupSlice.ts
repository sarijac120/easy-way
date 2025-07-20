import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RideGroup } from '../types/rideGroup';

interface RideGroupsState {
  groups: RideGroup[];
  loading: boolean;
  error: string | null;
}


const initialState: RideGroupsState = {
  groups: [],
  loading: false,
  error: null,
};

export const fetchRideGroups = createAsyncThunk(
  'rideGroups/fetch',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8000/api/rideGroup/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as RideGroup[];
  }
);

const rideGroupsSlice = createSlice({
  name: 'rideGroups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRideGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRideGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchRideGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error loading groups';
      });
  },
});

export default rideGroupsSlice.reducer;
