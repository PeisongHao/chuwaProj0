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
  const token = getState().auth.token;
  const config = {
    headers: {
      "x-auth-token": token,
      "Content-Type": "application/json",
    },
  };

  let response;
  if (data === null) {
    response = await axios[method](`${API_BASE_URL}/${endpoint}`, config);
  } else {
    response = await axios[method](`${API_BASE_URL}/${endpoint}`, data, config);
  }
  return response.data;
};

const createCartApiCall = (endpoint, method = "get") => {
  return createAsyncThunk(`cart/${endpoint}`, async (payload, { getState }) => {
    return createApiRequest(getState, method, endpoint, payload);
  });
};

// promo code处理
export const applyPromoCode = createAsyncThunk(
  "cart/applyPromoCode",
  async (promoCode, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
    };
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/promo`,
        { promoCode },
        config
      );
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue({ message: error.response.data.message });
      }
      return rejectWithValue({ message: error.message || "Failed to apply promo code" });
    }
  }
);

export const fetchCart = createCartApiCall("cart", "get");
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
    clearCartState: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.promoCode = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        updateCartState(state, action);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.status = "succeeded"; // promo code错误不能影响购物车状态
        state.error = action.payload?.message || action.error.message;
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
          action.type.startsWith("cart/") && 
          action.type.endsWith("/rejected") &&
          action.type !== "cart/applyPromoCode/rejected",
        (state, action) => {
          state.status = "failed";
          state.error = action.payload?.message || action.error.message;
        }
      );
  },
});

export const { clearError, clearCartState } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartTotalQuantity = (state) => {
  return state.cart.items.reduce((total, item) => total + item.amount, 0);
};
export const selectPromoCode = (state) => state.cart.promoCode;

export default cartSlice.reducer;
