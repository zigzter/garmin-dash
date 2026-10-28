const BASE_URL = "https://personal.connectapi.garmin.com";
const TOKEN_PATH = "/personalapitoken-service/personal-api/personal-api-key/token";

let token: { value: string; expiresAt: number } | undefined;

async function getToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && token && Date.now() < token.expiresAt - 60_000) return token.value;

  const res = await fetch(BASE_URL + TOKEN_PATH, {
    method: "POST",
    headers: { Authorization: `ApiKey ${process.env.GARMIN_API_KEY}` },
  });
  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${await res.text()}`);

  const access_token = (await res.text()).trim();
  const { exp } = JSON.parse(Buffer.from(access_token.split(".")[1], "base64url").toString());
  token = { value: access_token, expiresAt: exp * 1000 };
  return token.value;
}

async function request(path: string, params?: Record<string, string | number>): Promise<Response> {
  const url = new URL(BASE_URL + path);
  for (const [key, value] of Object.entries(params ?? {})) url.searchParams.set(key, String(value));

  let res = await fetch(url, { headers: { Authorization: `Bearer ${await getToken()}` } });
  // Tokens can stop working before their expiry.
  if (res.status === 401) {
    res = await fetch(url, { headers: { Authorization: `Bearer ${await getToken(true)}` } });
  }
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status} ${await res.text()}`);
  return res;
}

export async function garminGet<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  return (await request(path, params)).json() as Promise<T>;
}

export async function garminDownload(path: string): Promise<Uint8Array> {
  return new Uint8Array(await (await request(path)).arrayBuffer());
}
