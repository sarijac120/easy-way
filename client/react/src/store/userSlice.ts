import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  token: string | null;
  userName: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

const initialState: UserState = {
  token: null,
  userName: '',
  email: '',
  role: '',
  avatarUrl: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.avatarUrl = action.payload.avatarUrl;
    },
    logout(state) {
      state.token = null;
      state.userName = '';
      state.email = '';
      state.role = '';
      state.avatarUrl = '';
    }
  }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
