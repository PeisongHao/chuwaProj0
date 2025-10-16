import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk("users/login", async () => {
  const res = await fetch("http://localhost:3000/api/auth/login");
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    loading: false,
    error: null,
    user: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {logout} = authSlice.actions;
export const token = (state) => state.auth.token;
export const user = (state) => state.auth.user;
export default authSlice.reducer;
