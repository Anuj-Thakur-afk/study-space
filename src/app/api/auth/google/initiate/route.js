import { NextResponse } from "next/server";

/**
 * GET /api/auth/google/initiate
 *
 * Builds and returns the Google OAuth 2.0 authorization URL.
 * The client redirects the user to this URL to begin the consent flow.
 * We use a server-side route so the client_id stays in env vars and
 * never needs to be embedded in frontend JS.
 */
export async function GET(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        error:
          "Google OAuth is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI to your environment variables.",
      },
      { status: 503 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.json({ authorizationUrl });
}
