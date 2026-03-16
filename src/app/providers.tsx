// providers.tsx — FIXED
"use client";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { fetchCurrentUser, hydrateAuth } from "@/store/slices/authSlice";

function AuthInitializer() {
  useEffect(() => {
    // 1. Hydrate from localStorage FIRST (synchronous — sets isAuth immediately)
    store.dispatch(hydrateAuth());

    // 2. Then check if token exists and validate with backend
    const token = store.getState().auth.accessToken;
    if (token) store.dispatch(fetchCurrentUser());
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}


