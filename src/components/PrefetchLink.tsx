// src\components\PrefetchLink.tsx

import { Link, type LinkProps } from "react-router-dom";
import { prefetchOnHover } from "@nihil_frontend/shared/prefetch";

type PrefetchLinkProps = LinkProps & { prefetch?: () => void };

export default function PrefetchLink({
  prefetch,
  ...props
}: PrefetchLinkProps) {
  const hover = prefetch ? prefetchOnHover<HTMLAnchorElement>(prefetch) : {};
  return (
    <Link
      {...props}
      {...hover}
      className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
    />
  );
}
