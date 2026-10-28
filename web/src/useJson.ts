import { useEffect, useState } from "react";

export function useJson<T>(url: string) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetch(url)
      .then(async (res) => (res.ok ? setData(await res.json()) : setError(await res.text())))
      .catch((e: Error) => setError(e.message));
  }, [url]);

  return { data, error };
}
