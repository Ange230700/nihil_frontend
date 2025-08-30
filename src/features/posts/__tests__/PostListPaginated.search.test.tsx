// src\features\posts\__tests__\PostListPaginated.search.test.tsx

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostListPaginated from "@nihil_frontend/features/posts/PostListPaginated";
import { renderWithProviders } from "@nihil_frontend/tests/utils/renderWithProviders";
import {
  POSTS,
  POSTS_SEARCH_FIX,
} from "@nihil_frontend/tests/msw/fixtures/posts";

describe("PostListPaginated - search", () => {
  it("filters by query and shows only matching items", async () => {
    renderWithProviders(<PostListPaginated />);

    // Ensure initial content is there
    await screen.findByText(POSTS[0].content);

    const search = screen.getByLabelText(/search/i);
    await userEvent.clear(search);
    await userEvent.type(search, POSTS_SEARCH_FIX.token);

    // Press Enter to force a refetch immediately (component supports it)
    await userEvent.keyboard("{Enter}");

    // Expect a known matching item to appear
    const match = await screen.findByText(POSTS_SEARCH_FIX.expectedContent);
    expect(match).toBeInTheDocument();

    // And a previous first item to be gone (most likely, given filtering)
    expect(screen.queryByText(POSTS[0].content)).not.toBeInTheDocument();
  });
});
