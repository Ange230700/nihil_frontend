// src\features\posts\__tests__\PostListPaginated.paging.test.tsx

import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostListPaginated from "@nihil_frontend/features/posts/PostListPaginated";
import { renderWithProviders } from "@nihil_frontend/tests/utils/renderWithProviders";

describe("PostListPaginated - paging & keepPreviousData", () => {
  it("renders first page, keeps previous items while loading next page, then swaps to new page", async () => {
    renderWithProviders(<PostListPaginated />);

    // Initial load → expect first page (#1..#10)
    const firstItem = await screen.findByText("Post #1");
    expect(firstItem).toBeInTheDocument();

    const list = screen.getByRole("list");
    let items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(10);
    expect(screen.getByText(/10 items on this page/i)).toBeInTheDocument();

    // Click "Next" → keepPreviousData keeps old items while fetching
    const nextBtn = screen.getByRole("button", { name: /next/i });
    await userEvent.click(nextBtn);

    // Old content should still be visible immediately after click
    expect(screen.getByText("Post #1")).toBeInTheDocument();

    // The list fades during fetch (opacity ~0.6). Assert style changed.
    expect(list).toHaveStyle({
      opacity: expect.stringMatching(/^0\./) as unknown as string,
    });

    // When the next page arrives, first item becomes #11 and #1 disappears
    const page2First = await screen.findByText("Post #11");
    expect(page2First).toBeInTheDocument();
    expect(screen.queryByText("Post #1")).not.toBeInTheDocument();

    // Still 10 items on the page
    items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(10);
  });

  it("supports Prev to go back to previous cursor", async () => {
    renderWithProviders(<PostListPaginated />);

    await screen.findByText("Post #1");
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText("Post #11");

    const prevBtn = screen.getByRole("button", { name: /prev/i });
    await userEvent.click(prevBtn);

    // Back to page 1
    expect(await screen.findByText("Post #1")).toBeInTheDocument();
    expect(screen.queryByText("Post #11")).not.toBeInTheDocument();
  });
});
