import { NextResponse } from "next/server";
import { randomState, xeroAuthorizeUrl } from "@/lib/xero/oauth";

const SCOPES = [
  // Identity
  "offline_access",
  "openid",
  "profile",
  "email",
  // Accounting (MVP)
  "accounting.transactions",
  "accounting.contacts",
  // If you want accounts for COA suggestions later, add: "accounting.settings"
];

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const orgId = searchParams.get("orgId") || "";

  const clientId = process.env.XERO_CLIENT_ID;
  const redirectUri = process.env.XERO_REDIRECT_URI || `${origin}/api/xero/oauth/callback`;

  if (!clientId) {
    return NextResponse.json({ error: "Missing XERO_CLIENT_ID" }, { status: 500 });
  }
  if (!orgId) {
    return NextResponse.json({ error: "Missing orgId" }, { status: 400 });
  }

  const state = randomState();
  const authUrl = xeroAuthorizeUrl({ clientId, redirectUri, state, scopes: SCOPES });

  // Store state+orgId in short-lived cookies for CSRF protection.
  const res = NextResponse.redirect(authUrl);
  res.cookies.set("xero_oauth_state", state, { httpOnly: true, sameSite: "lax", secure: true, maxAge: 600, path: "/" });
  res.cookies.set("xero_oauth_org", orgId, { httpOnly: true, sameSite: "lax", secure: true, maxAge: 600, path: "/" });
  res.cookies.set("xero_oauth_return", `${origin}/dashboard/settings/xero`, { httpOnly: true, sameSite: "lax", secure: true, maxAge: 600, path: "/" });
  return res;
}
