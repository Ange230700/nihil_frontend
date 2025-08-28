// src\routes\router.tsx

import {
  createBrowserRouter,
  redirect,
  type ActionFunctionArgs,
} from "react-router-dom";
import RootLayout from "@nihil_frontend/routes/RootLayout";
import RootErrorBoundary from "@nihil_frontend/routes/RootErrorBoundary";
import HomeRoute, {
  HomeErrorBoundary,
  type HomeDeferData,
} from "@nihil_frontend/routes/HomeRoute";
import type { UserDTO } from "@nihil_frontend/api/users";
import type { PostDTO } from "@nihil_frontend/entities/post/schemas";

const UAPI = import.meta.env.VITE_USER_SERVICE_API_URL;
const PAPI = import.meta.env.VITE_POST_SERVICE_API_URL;

/** Simple error you can throw in loaders/actions */
class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

/* ------------ Home loader/action (child route) ------------ */
export function homeLoader() {
  const usersP: Promise<UserDTO[]> = fetch(`${UAPI}/users`, {
    credentials: "include",
  }).then((r) => readData<UserDTO[]>(r));

  const postsP: Promise<PostDTO[]> = fetch(`${PAPI}/posts`, {
    credentials: "include",
  }).then((r) => readData<PostDTO[]>(r));

  return { users: usersP, posts: postsP } satisfies HomeDeferData;
}

// Helper: return j.data (if present) or j; throw Error on non-OK
async function readData<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `HTTP ${String(res.status)} ${res.statusText}`;
    try {
      const body: unknown = await res.json();
      if (isObject(body)) {
        const err = (body as { error?: unknown }).error;
        if (
          isObject(err) &&
          typeof (err as { message?: unknown }).message === "string"
        ) {
          msg = (err as { message: string }).message;
        }
      }
    } catch {
      // ignore JSON parse issues; keep default msg
    }
    throw new Error(msg);
  }

  const json: unknown = await res.json();
  return (
    isObject(json) && "data" in json ? (json as { data: unknown }).data : json
  ) as T;
}

/** Type guard helpers */
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Safely read an API error message from unknown */
function getApiErrorMessage(body: unknown, fallback: string): string {
  if (isObject(body) && "error" in body) {
    const err = (body as { error?: unknown }).error;
    if (isObject(err) && "message" in err) {
      const msg = (err as { message?: unknown }).message;
      if (typeof msg === "string") return msg;
    }
  }
  return fallback;
}

export async function homeAction({ request }: ActionFunctionArgs) {
  const form = await request.formData();

  // string guards to avoid no-base-to-string issues
  const asString = (key: string): string | undefined => {
    const v = form.get(key);
    return typeof v === "string" ? v : undefined;
  };
  const requireString = (key: string): string => {
    const v = asString(key);
    if (!v) throw new HttpError(400, `Invalid or missing "${key}"`);
    return v;
  };

  const intent = asString("intent") ?? "";

  if (intent === "createUser") {
    const body = {
      username: requireString("username"),
      email: requireString("email"),
      password: requireString("password"),
    };

    const res = await fetch(`${UAPI}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const b: unknown = await tryJson(res);
      throw new HttpError(
        res.status,
        getApiErrorMessage(b, "Create user failed"),
      );
    }
    return redirect("/");
  }

  if (intent === "createPost") {
    const body = {
      userId: requireString("userId"),
      content: requireString("content"),
    };

    const res = await fetch(`${PAPI}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const b = await tryJson(res);
      throw new HttpError(
        res.status,
        getApiErrorMessage(b, "Create post failed"),
      );
    }
    return redirect("/");
  }

  throw new HttpError(400, "Unknown intent");
}

async function tryJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/* ------------------------ Router ------------------------- */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomeRoute />,
        loader: homeLoader,
        action: homeAction,
        errorElement: <HomeErrorBoundary />,
      },
      { path: "*", element: <div className="p-4">Not Found</div> },
    ],
  },
]);
