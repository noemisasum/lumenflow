import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { xeroExchangeCode, xeroGetConnections } from "@/lib/xero/oauth";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code") || "";
    const state = url.searchParams.get("state") || "";

    if (!code || !state) {
      return NextResponse.json({ error: "Missing code/state" }, { status: 400 });
    }

    const cookieState = (req as any).cookies?.get?.("xero_oauth_state")?.value;
    const cookieOrg = (req as any).cookies?.get?.("xero_oauth_org")?.value;
    const cookieReturn = (req as any).cookies?.get?.("xero_oauth_return")?.value;

    // In Next route handlers, cookies are not on req; use NextResponse to read via headers.
    // Fallback: read Cookie header manually.
    const cookieHeader = req.headers.get("cookie") || "";
    const getCookie = (name: string) => {
      const m = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
      return m ? decodeURIComponent(m[1]) : null;
    };

    const expectedState = cookieState || getCookie("xero_oauth_state");
    const orgId = cookieOrg || getCookie("xero_oauth_org");
    const returnTo = cookieReturn || getCookie("xero_oauth_return") || "/dashboard/settings/xero";

    if (!expectedState || state !== expectedState) {
      return NextResponse.json({ error: "Invalid state" }, { status: 400 });
    }
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    const redirectUri = process.env.XERO_REDIRECT_URI || `${url.origin}/api/xero/oauth/callback`;
    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Missing XERO_CLIENT_ID/XERO_CLIENT_SECRET" }, { status: 500 });
    }

    const token = await xeroExchangeCode({ clientId, clientSecret, redirectUri, code });
    const connections = await xeroGetConnections(token.access_token);

    const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();

    const supabase = getSupabaseAdmin();

    // Upsert org-level connection
    const { error: upErr } = await supabase.from("xero_connections").upsert(
      {
        org_id: orgId,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_at: expiresAt,
        scope: token.scope,
      },
      { onConflict: "org_id" }
    );
    if (upErr) throw upErr;

    // Replace tenant list
    await supabase.from("xero_tenants").delete().eq("org_id", orgId);
    const tenantsPayload = connections.map((c) => ({
      org_id: orgId,
      tenant_id: c.tenantId,
      tenant_name: c.tenantName,
      tenant_type: c.tenantType,
    }));
    if (tenantsPayload.length) {
      const { error: tErr } = await supabase.from("xero_tenants").insert(tenantsPayload);
      if (tErr) throw tErr;
    }

    const res = NextResponse.redirect(returnTo);
    // clear cookies
    res.cookies.set("xero_oauth_state", "", { maxAge: 0, path: "/" });
    res.cookies.set("xero_oauth_org", "", { maxAge: 0, path: "/" });
    res.cookies.set("xero_oauth_return", "", { maxAge: 0, path: "/" });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "OAuth callback failed" }, { status: 500 });
  }
}
