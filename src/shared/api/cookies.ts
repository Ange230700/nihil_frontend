// src\shared\api\cookies.ts

export function getCookie(name: string): string | undefined {
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : undefined;
}
