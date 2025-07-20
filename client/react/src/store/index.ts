import { configureStore } from '@reduxjs/toolkit';
import rideGroupsReducer from './rideGroupSlice'; 
import authReducer from './authSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    rideGroups: rideGroupsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;