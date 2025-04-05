import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,  // Store the user object here
    isAuthenticated: false, // Keep track of login state
  },
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    }
    ,
    logout(state) {
      state.user = null;  // Clear user data when logged out
      state.isAuthenticated = false;  // Set login state to false
    },
    setUser(state, action) {
      state.user = action.payload.user;  // Store user data
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;