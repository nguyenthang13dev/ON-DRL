"use client";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// ...existing code...

export function Providers({ children }: { children: any }) {
  // Only render PersistGate if persistor exists (client side)
  if (persistor) {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    );
  }
  // On server, just use Provider
  return <Provider store={store}>{children}</Provider>;
}
