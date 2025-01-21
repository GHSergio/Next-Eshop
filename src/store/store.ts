import { configureStore } from "@reduxjs/toolkit";
import productReducer from "@/store/slice/productSlice";
import userReducer from "@/store/slice/userSlice";
import deliveryLocationReducer from "@/store/slice/deliveryLocationSlice";
import storelocationReducer from "@/store/slice/storeLocationSlice";
import themeReducer from "@/store/slice/themeSlice";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 默認使用 localStorage

// Transform 配置
const activeStepTransform = createTransform(
  (inboundState: number) => (inboundState !== null ? Number(inboundState) : 0),
  (outboundState: number) =>
    outboundState !== null ? Number(outboundState) : 0,
  { whitelist: ["activeStep"] } // 僅針對 activeStep 應用
);

// persist 配置
const persistConfig = {
  key: "user", // 定義 persist 的 key
  storage, // 使用 localStorage 儲存狀態
  whitelist: [
    "selectedItems",
    "selectedPayment",
    "activeStep",
    "store_info",
    "delivery_info",
    "creditCard_info",
  ], // 只持久化這些狀態
  transforms: [activeStepTransform], // 使用 transform
  debug: true, // 打開 debug
};

// 持久化的 Reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

const persistThemeReducer = persistReducer(persistConfig, themeReducer);

//configureStore()創建store
export const store = configureStore({
  reducer: {
    products: productReducer,
    user: persistedUserReducer,
    deliveryLocation: deliveryLocationReducer,
    storeLocation: storelocationReducer,
    theme: persistThemeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略 Redux Persist 的 `register` 和 `rehydrate`
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
