import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

// 导入reducer
import cartReducer from "../feature/cart/cartSlice";

// 模拟的auth reducer（用于独立开发）
const authReducer = (state = {
  token: null,
  loading: false,
  error: null,
  user: null
}, action) => {
  switch (action.type) {
    case 'auth/login/pending':
      return { ...state, loading: true, error: null };
    case 'auth/login/fulfilled':
      return { 
        ...state, 
        loading: false, 
        token: action.payload?.token || null,
        user: action.payload?.user || null
      };
    case 'auth/login/rejected':
      return { 
        ...state, 
        loading: false, 
        error: action.error.message 
      };
    case 'auth/logout':
      return {
        token: null,
        loading: false,
        error: null,
        user: null
      };
    default:
      return state;
  }
};

const persistConfig = {
  key: "root",
  storage, // localStorage
  whitelist: ["auth", "cart"], // 持久化 auth 和 cart 模块
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
