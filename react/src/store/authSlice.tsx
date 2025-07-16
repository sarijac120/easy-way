import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/user/';

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface UserData {
  token: string;
  [key: string]: any;
}

const token = localStorage.getItem('token');
let user = null;
try {
  const userStr = localStorage.getItem('user');
  if (userStr) user = JSON.parse(userStr);
} catch (e) {
  user = null;
}

// the start state
const initialState: AuthState = {
  user: user, // if exist is loading from the localstorage
  token: token,
  loading: false,
  error: null,
};

// createAsyncThunk 
export const login = createAsyncThunk<UserData, { email: string; password: string }>(
  '/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL + 'login', credentials);
      //keep the token after a good login
      localStorage.setItem('token', response.data.token);
      return response.data; // if succes the answer will go to the reducer
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login Failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk<UserData, any>(
  '/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL + 'register', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration Failed';
      return rejectWithValue(errorMessage);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.user = action.payload; // שומר את כל פרטי המשתמש
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // saving the error massage
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;