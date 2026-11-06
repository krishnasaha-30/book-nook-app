import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { db, mongoClient } from "@/lib/mongodb";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

const trustedOrigins = Array.from(
  new Set([baseURL, "http://localhost:3000"]),
);

/**
 * Google sign-in only appears when credentials exist, so the login and
 * register pages can hide the button in environments without them.
 */
export const isGoogleLoginEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const auth = betterAuth({
  appName: "BookNook",
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, {
    client: mongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined,
  trustedOrigins,
  plugins: [
    // Issues the short-lived JWT that the BookNook API verifies through
    // /api/auth/jwks.
    jwt(),
    // Must stay last: lets Better Auth set cookies from server actions.
    nextCookies(),
  ],
});
