// src/usersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    // addUser: (state, action) => {
    //   state.push(action.payload);
    // },
    addUsers: (state, action) => {
      // Ensure action.payload is an array of user objects
      state.push(...action.payload);
    },
    // removeUser: (state, action) => {
    //   return state.filter(user => user.id !== action.payload);
    // },
    // updateUser: (state, action) => {
    //   const index = state.findIndex(user => user.id === action.payload.id);
    //   if (index !== -1) {
    //     state[index] = action.payload;
    //   }
    // },
  },
});

export const { addUser, addUsers, removeUser, updateUser } = usersSlice.actions;

export default usersSlice.reducer;
