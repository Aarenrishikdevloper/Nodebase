import { betterAuth, } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { db } from "./db/index";
import * as schema from "./db/schema";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    }, // or "pg" or "mysql"
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },

  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "c567a5bb-6c4d-48a1-ac05-18837cb3cf05",
              slug: "Pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Pro
            }

          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true
        }),
        portal()
      ]
    })
  ]
  //... the rest of your config
});
