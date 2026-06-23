import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

// Entra ID (Azure AD) auth via Auth.js. Enabled only when AUTH_ENABLED=true and the
// AUTH_MICROSOFT_ENTRA_ID_* env vars are set. In dev (flag off) the app runs without login.
export const authEnabled = process.env.AUTH_ENABLED === "true";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: authEnabled
    ? [
        MicrosoftEntraID({
          clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
          clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
          issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
          authorization: { params: { scope: `openid profile email ${process.env.AUTH_API_SCOPE ?? ""}`.trim() } },
        }),
      ]
    : [],
  callbacks: {
    // Persist the Entra access token so the client can call the Go API with it.
    async jwt({ token, account }) {
      if (account?.access_token) token.accessToken = account.access_token;
      return token;
    },
    async session({ session, token }) {
      (session as { accessToken?: string }).accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
});
