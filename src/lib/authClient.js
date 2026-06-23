import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL)?.replace('/api', '') || (process.env.NODE_ENV === "production" ? "https://startup-forge-backend.vercel.app" : "http://localhost:5000"),
});

export const { signIn, signUp, useSession } = authClient;
