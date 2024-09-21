import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinStart: (state) => {
      state.loading = true;
    },
    signInSuccuss: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccuss: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    deleteUserStart:(state) =>{
        state.loading = true;
    },
    deleteUserSuccuss: (state) => {
        state.currentUser = null;
        state.loading = false;
        state.error = null;
      },
      deleteUserFailure: (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
      },
      signoutUserStart:(state) =>{
        state.loading = true;
    },
    signoutUserSuccuss: (state) => {
        state.currentUser = null;
        state.loading = false;
        state.error = null;
      },
      signoutUserFailure: (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
      },
      

  },
});

export const {
  signinStart,
  signInSuccuss,
  signInFailure,
  updateUserStart,
  updateUserSuccuss,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccuss,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccuss,
  signoutUserFailure
} = userSlice.actions;

export default userSlice.reducer;
