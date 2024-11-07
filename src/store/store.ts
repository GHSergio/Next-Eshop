"use client";
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slice/productSlice";

//configureStore()創建store
const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
