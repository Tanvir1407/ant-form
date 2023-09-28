import { configureStore } from '@reduxjs/toolkit';
import dataReducers from '../features/Data/dataSlice';

export const store = configureStore({
  reducer: {
    data: dataReducers,
  },
});