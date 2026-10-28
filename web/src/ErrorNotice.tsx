import { AlertTriangle, RotateCw } from "lucide-react";
import type { ApiError } from "../../server/api.types.ts";

export function ErrorNotice({ error, retry }: { error: ApiError; retry: () => void }) {
  if (error.kind === "auth") {
    return (
      <div className="notice" role="alert">
        <h3>
          <AlertTriangle size={16} aria-hidden /> Garmin rejected the API key
        </h3>
        <p>
          Personal API keys expire. Create a new key in{" "}
          <a href="https://connect.garmin.com/app/settings/personalApiToken" target="_blank" rel="noreferrer">
            Garmin Connect
          </a>
          , set it as <code>GARMIN_API_KEY</code> in <code>.env</code>, and restart the server.
        </p>
        <button className="button" onClick={retry}>
          <RotateCw size={14} aria-hidden /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="notice" role="alert">
      <h3>
        <AlertTriangle size={16} aria-hidden /> Could not load data from Garmin
      </h3>
      <p className="notice-detail">{error.error}</p>
      <button className="button" onClick={retry}>
        <RotateCw size={14} aria-hidden /> Try again
      </button>
    </div>
  );
}
