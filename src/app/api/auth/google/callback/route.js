import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signToken, TOKEN_COOKIE_NAME } from "@/lib/auth";

/**
 * GET /api/auth/google/callback
 *
 * Handles the OAuth 2.0 authorization code callback from Google.
 *
 * Security model:
 *  - Exchanges the short-lived authorization code for tokens server-side.
 *  - Verifies the ID token with Google's tokeninfo endpoint.
 *  - Only trusts the `email`, `name`, and `sub` returned by Google's servers.
 *  - Never trusts client-supplied identity.
 *  - Google login CANNOT create or elevate to ADMIN accounts.
 *  - Issues the existing JWT + HttpOnly cookie session for the authenticated user.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // --- Handle cancelled login or OAuth error ---
  if (error || !code) {
    const reason = error === "access_denied" ? "login_cancelled" : "oauth_error";
    return NextResponse.redirect(
      new URL(`/login?error=${reason}`, request.url)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url)
    );
  }

  try {
    // --- Step 1: Exchange authorization code for tokens ---
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.id_token) {
      console.error("Google token exchange failed:", tokenData.error_description || tokenData.error);
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_failed", request.url)
      );
    }

    // --- Step 2: Verify ID token with Google's tokeninfo endpoint ---
    // This validates the token and returns the user's Google profile data.
    const tokenInfoResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenData.id_token}`
    );
    const tokenInfo = await tokenInfoResponse.json();

    if (!tokenInfoResponse.ok || tokenInfo.error) {
      console.error("Google token verification failed:", tokenInfo.error_description || tokenInfo.error);
      return NextResponse.redirect(
        new URL("/login?error=token_verification_failed", request.url)
      );
    }

    // Validate the token is for our application
    if (tokenInfo.aud !== clientId) {
      console.error("Google token audience mismatch — potential token substitution attack");
      return NextResponse.redirect(
        new URL("/login?error=invalid_token", request.url)
      );
    }

    // Require a verified email
    if (tokenInfo.email_verified !== "true" && tokenInfo.email_verified !== true) {
      return NextResponse.redirect(
        new URL("/login?error=email_not_verified", request.url)
      );
    }

    const { sub: googleId, email, name } = tokenInfo;

    if (!googleId || !email) {
      return NextResponse.redirect(
        new URL("/login?error=missing_profile_data", request.url)
      );
    }

    // --- Step 3: Find or create user in MongoDB ---
    await connectDB();

    // Try to find by googleId first, then fall back to email
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if a user with this email already exists (email/password account)
      user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        // Link existing email/password account with this Google account
        // SECURITY: We never change the role here — existing role is preserved.
        // SECURITY: We never elevate to ADMIN.
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
      } else {
        // Create a new STUDENT account — Google users are ALWAYS students
        user = await User.create({
          name: name || email.split("@")[0],
          email: email.toLowerCase(),
          googleId,
          passwordHash: null, // Google users have no password
          role: "STUDENT",    // ALWAYS STUDENT — never ADMIN
        });
      }
    }

    // SECURITY: Refuse to sign in if the account is ADMIN via Google
    // Admin accounts must use email/password only.
    if (user.role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/login?error=admin_google_not_allowed", request.url)
      );
    }

    // --- Step 4: Issue existing JWT + HttpOnly session cookie ---
    const token = signToken(user);

    const response = NextResponse.redirect(
      new URL("/dashboard", request.url)
    );

    response.cookies.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    // Never log OAuth tokens or secrets
    console.error("Google OAuth callback error:", err.message);
    return NextResponse.redirect(
      new URL("/login?error=server_error", request.url)
    );
  }
}
