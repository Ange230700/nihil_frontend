// src\components\SkeletonList.tsx
import { Skeleton } from "primereact/skeleton";

interface Props {
  rows?: number;
  withAvatar?: boolean;
  className?: string;
  "aria-label"?: string;
}

function makeKeys(count: number): string[] {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

export default function SkeletonList({
  rows = 6,
  withAvatar = false,
  className,
  ...aria
}: Readonly<Props>) {
  const keys = makeKeys(rows);

  return (
    <output aria-live="polite" aria-busy="true" className={className} {...aria}>
      <ul className="divide-y">
        {keys.map((key) => (
          <li key={key} className="flex items-center gap-3 py-3">
            {withAvatar && <Skeleton shape="circle" size="2.5rem" />}
            <div className="flex-1">
              <Skeleton width="60%" height="1.1rem" className="mb-2" />
              <Skeleton width="35%" height="0.9rem" />
            </div>
          </li>
        ))}
      </ul>
    </output>
  );
}
