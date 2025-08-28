// src\routes\RootErrorBoundary.tsx

import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RootErrorBoundary() {
  const err = useRouteError();
  if (isRouteErrorResponse(err)) {
    return (
      <div className="mx-auto max-w-xl p-4">
        <h2 className="mb-2 text-xl font-bold">Error {err.status}</h2>
        <p>{(err.data as { message: string }).message}</p>
      </div>
    );
  }
  const msg = err instanceof Error ? err.message : "Something went wrong.";
  return (
    <div className="mx-auto max-w-xl p-4">
      <h2 className="mb-2 text-xl font-bold">Unexpected Error</h2>
      <p>{msg}</p>
    </div>
  );
}
