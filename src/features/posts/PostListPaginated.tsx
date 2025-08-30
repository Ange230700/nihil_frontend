// src\features\posts\PostListPaginated.tsx

import { useMemo, useState, type ReactNode } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { useDebouncedValue } from "@nihil_frontend/shared/hooks/useDebouncedValue";
import { usePosts } from "@nihil_frontend/entities/post/hooks";

const PAGE_SIZES = [5, 10, 20] as const;
type PageSize = (typeof PAGE_SIZES)[number];

export default function PostListPaginated() {
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search, 300);

  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<string[]>([]);

  const [limit, setLimit] = useState<PageSize>(10);
  const skeletonKeys = useMemo(
    () => Array.from({ length: limit }, () => crypto.randomUUID()),
    [limit],
  );

  const resetPaging = () => {
    setCursor(null);
    setCursorStack([]);
  };

  const { data, isLoading, isFetching, isError, refetch } = usePosts({
    limit,
    cursor,
    q: debounced,
  });

  const items = data?.items ?? [];
  const nextCursor = data?.nextCursor ?? null;

  function goNext() {
    if (!nextCursor) return;
    setCursorStack((s) => [...s, cursor ?? ""]);
    setCursor(nextCursor);
  }
  function goPrev() {
    if (!cursorStack.length) return;
    const copy = [...cursorStack];
    const prev = copy.pop() ?? null;
    setCursorStack(copy);
    setCursor(prev?.length ? prev : null);
  }
  function onLimitChange(e: { value: unknown }) {
    const v = e.value;
    if (typeof v === "number" && PAGE_SIZES.includes(v as PageSize)) {
      setLimit(v as PageSize);
      resetPaging();
    }
  }

  let content: ReactNode;
  if (isLoading) {
    content = (
      <div className="space-y-2">
        {skeletonKeys.map((k) => (
          <Skeleton key={k} height="2.25rem" />
        ))}
      </div>
    );
  } else if (isError) {
    content = (
      <div className="text-red-500">
        Failed to load posts.{" "}
        <button
          type="button"
          onClick={() => void refetch()}
          className="underline"
        >
          Retry
        </button>
      </div>
    );
  } else if (items.length === 0) {
    content = <div>No results.</div>;
  } else {
    content = (
      <ul
        className="divide-y transition-opacity"
        style={{ opacity: isFetching ? 0.6 : 1 }}
      >
        {items.map((p) => (
          <li key={p.id} className="py-2">
            <div>{p.content}</div>
            {p.createdAt && (
              <div className="text-xs text-gray-500">{p.createdAt}</div>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <span>
          <label className="mb-1 block text-sm">
            Search
            <InputText
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void refetch();
                }
              }}
              placeholder="Search posts…"
              className="min-w-[16rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            />
          </label>
        </span>

        <span>
          <label className="mb-1 block text-sm">
            Page size
            <Dropdown
              value={limit}
              options={PAGE_SIZES.map((n) => ({ label: String(n), value: n }))}
              onChange={onLimitChange}
              className="w-32"
            />
          </label>
        </span>

        <div className="ml-auto flex gap-2">
          <Button
            label="Prev"
            onClick={goPrev}
            disabled={!cursorStack.length || isFetching}
            outlined
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          />
          <Button
            label="Next"
            onClick={goNext}
            disabled={!nextCursor || isFetching}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          />
        </div>
      </div>

      {content}

      <div className="flex justify-between text-sm text-gray-500">
        <div>
          {items.length} item{items.length === 1 ? "" : "s"} on this page
        </div>
        <div>
          {cursorStack.length > 0 ? "Has prev" : "Start"} •{" "}
          {nextCursor ? "Has next" : "End"}
        </div>
      </div>
    </section>
  );
}
