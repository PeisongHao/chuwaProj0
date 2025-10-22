import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
  "users/login",
  async ({ username, password }) => {
    const res = await axios.post("http://localhost:3000/api/auth/login", {
      username,
      password,
    });
    console.log(res.data);
    return res.data;
  }
);

export const signup = createAsyncThunk(
  "users/signup",
  async ({ username, password, isAdmin }) => {
    const res = await axios.post("http://localhost:3000/api/users", {
      username,
      password,
      isAdmin,
    });
    return res.data;
  }
);

export const updatepwd = createAsyncThunk(
  "users/update ",
  async ({ username, password }) => {
    const res = await axios.put(
      "http://localhost:3000/api/users/updatePassword",
      {
        username,
        password,
      }
    );
    return res.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    loading: false,
    error: null,
    productList: null,
    //cartList: null,
    isAdmin: false,
  },
  reducers: {
    logout(state) {
      state.productList = null;
      //state.cartList = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isAdmin = false;
    },
    clearErrorMessage(state) {
      state.error = null;
      state.loading = false;
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
        state.token = action.payload?.token || null;
        state.productList = action.payload?.productList || null;
        //state.cartList = action.payload?.cartList || null;
        state.isAdmin = action.payload?.isAdmin || false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload?.token || null;
        state.productList = action.payload?.productList || null;
        //state.cartList = action.payload?.cartList || null;
        state.isAdmin = action.payload?.isAdmin || false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Sign Up failed";
      })
      .addCase(updatepwd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatepwd.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload?.token || null;
        state.productList = action.payload?.productList || null;
        //state.cartList = action.payload?.cartList || null;
        state.isAdmin = action.payload?.isAdmin || false;
      })
      .addCase(updatepwd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Update Password failed";
      });
  },
});

export const authErr = (state) => state.auth.error;
export const { logout, clearErrorMessage } = authSlice.actions;
export const token = (state) => state.auth.token;
export default authSlice.reducer;
