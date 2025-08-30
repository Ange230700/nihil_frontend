// src\features\posts\__tests__\PostListPaginated.search.test.tsx

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostListPaginated from "@nihil_frontend/features/posts/PostListPaginated";
import { renderWithProviders } from "@nihil_frontend/tests/utils/renderWithProviders";

describe("PostListPaginated - search", () => {
  it("filters by query and shows only matching items", async () => {
    renderWithProviders(<PostListPaginated />);

    // Ensure initial content is there
    await screen.findByText("Post #1");

    const search = screen.getByLabelText(/search/i);
    await userEvent.clear(search);
    await userEvent.type(search, "23");

    // Press Enter to force a refetch immediately (component supports it)
    await userEvent.keyboard("{Enter}");

    // Expect Post #23 to appear
    const match = await screen.findByText("Post #23");
    expect(match).toBeInTheDocument();

    // And non-matching early items to be gone
    expect(screen.queryByText("Post #1")).not.toBeInTheDocument();
  });
});
