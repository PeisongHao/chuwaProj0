import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../feature/auth/authSlice';

export function setupStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState
  });
}
