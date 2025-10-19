import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import authReducer from "../feature/auth/authSlice";
import productReducer from "../feature/product/productSlice";
import detailReducer from "../feature/product/detailSlice";

const persistConfig = {
  key: "root",
  storage, // localStorage
  whitelist: ["auth"], // 只持久化 auth 模块
};

const rootReducer = combineReducers({
  auth: authReducer,
  detail: detailReducer,
  product: productReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
