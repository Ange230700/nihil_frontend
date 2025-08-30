// src\features\posts\__tests__\PostListPaginated.paging.test.tsx

import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostListPaginated from "@nihil_frontend/features/posts/PostListPaginated";
import { renderWithProviders } from "@nihil_frontend/tests/utils/renderWithProviders";
import { POSTS } from "@nihil_frontend/tests/msw/fixtures/posts";

describe("PostListPaginated - paging & keepPreviousData", () => {
  it("renders first page, keeps previous items while loading next page, then swaps to new page", async () => {
    renderWithProviders(<PostListPaginated />);

    const firstContent = POSTS[0].content;
    const page2FirstContent = POSTS[10].content;

    // Initial load → first page (items 0..9)
    const firstItem = await screen.findByText(firstContent);
    expect(firstItem).toBeInTheDocument();

    const list = screen.getByRole("list");
    let items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(10);
    expect(screen.getByText(/10 items on this page/i)).toBeInTheDocument();

    // Click "Next" → keepPreviousData keeps old items while fetching
    const nextBtn = screen.getByRole("button", { name: /next/i });
    await userEvent.click(nextBtn);

    // Old content should still be visible immediately after click
    expect(screen.getByText(firstContent)).toBeInTheDocument();

    // The list fades during fetch (opacity ~0.6). Assert style changed.
    expect(list).toHaveStyle({
      opacity: expect.stringMatching(/^0\./) as unknown as string,
    });

    // When the next page arrives, first visible becomes item #11 (index 10)
    const page2First = await screen.findByText(page2FirstContent);
    expect(page2First).toBeInTheDocument();
    expect(screen.queryByText(firstContent)).not.toBeInTheDocument();

    // Still 10 items on the page
    items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(10);
  });

  it("supports Prev to go back to previous cursor", async () => {
    renderWithProviders(<PostListPaginated />);

    const firstContent = POSTS[0].content;
    const page2FirstContent = POSTS[10].content;

    await screen.findByText(firstContent);
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    await screen.findByText(page2FirstContent);

    const prevBtn = screen.getByRole("button", { name: /prev/i });
    await userEvent.click(prevBtn);

    // Back to page 1
    expect(await screen.findByText(firstContent)).toBeInTheDocument();
    expect(screen.queryByText(page2FirstContent)).not.toBeInTheDocument();
  });
});
