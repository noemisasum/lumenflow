import crypto from "crypto";

const AUTH_BASE = "https://login.xero.com";

export function xeroAuthorizeUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
  scopes: string[];
}): string {
  const url = new URL("/identity/connect/authorize", AUTH_BASE);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", params.scopes.join(" "));
  url.searchParams.set("state", params.state);
  return url.toString();
}

export function randomState(): string {
  return crypto.randomBytes(24).toString("hex");
}

export async function xeroExchangeCode(params: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
}) {
  const tokenUrl = "https://identity.xero.com/connect/token";

  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", params.code);
  body.set("redirect_uri", params.redirectUri);

  const basic = Buffer.from(`${params.clientId}:${params.clientSecret}`).toString("base64");

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Xero token exchange failed: ${res.status} ${JSON.stringify(json)}`);
  }
  return json as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    id_token?: string;
  };
}

export async function xeroGetConnections(accessToken: string) {
  const res = await fetch("https://api.xero.com/connections", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Xero connections failed: ${res.status} ${JSON.stringify(json)}`);
  }
  return json as Array<{
    id: string;
    tenantId: string;
    tenantType: string;
    tenantName: string;
    createdDateUtc: string;
    updatedDateUtc: string;
  }>;
}
