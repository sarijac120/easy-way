import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import axios from 'axios';
import { setUser } from './store/authSlice';

export function useHydrateUser() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    if (token && !user) {
      axios.get('http://localhost:8000/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          dispatch(setUser({
            ...res.data,
            token
          }));
        })
        .catch(() => {
        });
    }
  }, [token, user, dispatch]);
}