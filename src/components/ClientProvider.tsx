// src/components/ClientProvider.tsx
"use client";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      {/* PersistGate 加載 Redux Persist */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
