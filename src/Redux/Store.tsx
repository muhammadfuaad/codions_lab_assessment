// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './UsersSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

export default store;
