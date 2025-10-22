import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import authReducer from "../feature/auth/authSlice";
import productReducer from "../feature/product/productSlice";
import detailReducer from "../feature/product/detailSlice";
import cartReducer from "../feature/cart/cartSlice";

const persistConfig = {
  key: "root",
  storage, // localStorage
  whitelist: ["auth", "cart"], // 持久化 auth 和 cart 模块
};

const rootReducer = combineReducers({
  auth: authReducer,
  detail: detailReducer,
  product: productReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
