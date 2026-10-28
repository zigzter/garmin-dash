import { useCallback, useEffect, useState } from "react";
import type { ApiError } from "../../server/api.types.ts";

export function useJson<T>(url: string) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<ApiError>();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setData(undefined);
    setError(undefined);
    fetchJson<T>(url).then(setData, setError);
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { data, error, retry };
}

export async function fetchJson<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw { error: "The dashboard server is not responding.", kind: "upstream" } satisfies ApiError;
  }
  if (res.ok) return res.json();

  const body = await res.text();
  let parsed: ApiError | undefined;
  try {
    parsed = JSON.parse(body);
  } catch {}
  throw parsed?.kind ? parsed : ({ error: body || `Request failed with status ${res.status}.`, kind: "upstream" } satisfies ApiError);
}
