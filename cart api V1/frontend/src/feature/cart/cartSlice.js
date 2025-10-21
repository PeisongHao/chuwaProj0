import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  total: 0,
  itemCount: 0,
  promoCode: null,
};

const API_BASE_URL = "http://localhost:3000/api";

const createApiRequest = async (getState, method, endpoint, data = null) => {
  const { token } = getState().auth;
  const config = {
    headers: { "x-auth-token": token },
    ...(data && { data }),
  };

  const response = await axios[method](`${API_BASE_URL}/${endpoint}`, config);
  return response.data;
};

const createCartApiCall = (endpoint, method = "get") => {
  return createAsyncThunk(`cart/${endpoint}`, async (payload, { getState }) => {
    return createApiRequest(getState, method, endpoint, payload);
  });
};

export const fetchCart = createCartApiCall("cart", "get");
export const applyPromoCode = createCartApiCall("cart/promo", "post");
export const updateCartItem = createCartApiCall("cart/item", "put");
export const clearCart = createCartApiCall("cart/clear", "delete");

const updateCartState = (state, action) => {
  state.status = "succeeded";
  if (action.payload.cartItems) {
    state.items = action.payload.cartItems;
    state.total = action.payload.summary?.finalTotal || 0;
    state.itemCount = action.payload.summary?.itemCount || 0;
    state.promoCode = action.payload.summary?.discount || null;
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 购物车状态更新 - addCase 必须在 addMatcher 之前
      .addCase(fetchCart.fulfilled, (state, action) => {
        updateCartState(state, action);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        // 更新商品后需要重新获取购物车数据
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        // 应用优惠码后需要重新获取购物车数据
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = "succeeded";
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
        state.promoCode = null;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload?.message || action.error.message;
        }
      );
  },
});

export const { clearError } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectPromoCode = (state) => state.cart.promoCode;

export default cartSlice.reducer;
