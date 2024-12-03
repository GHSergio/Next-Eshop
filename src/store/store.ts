"use client";
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slice/productSlice";
import userReducer from "./slice/userSlice";
import locationReducer from "./slice/locationSlice";
import storelocationReducer from "./slice/storeLocationSlice";
//configureStore()創建store
const store = configureStore({
  reducer: {
    products: productReducer,
    user: userReducer,
    location: locationReducer,
    storeLocation: storelocationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
