// src\features\users\__tests__\UserCreateForm.success.test.tsx

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@nihil_frontend/tests/msw/server";
import { renderWithI18nAndToast } from "@nihil_frontend/tests/utils/renderWithI18nAndToast";
import UserCreateForm from "@nihil_frontend/features/users/UserCreateForm";

// MSW for POST /users (supports '/users' or '/api/users')
const postUsersOk = http.post(/\/users$/, async ({ request }) => {
  const body = (await request.json()) as {
    username: string;
    email: string;
    password: string;
  };
  return HttpResponse.json({ data: { id: "u_1", ...body } }, { status: 200 });
});

describe("UserCreateForm - happy path", () => {
  it("submits valid data and shows success toast, then clears fields", async () => {
    server.use(postUsersOk);

    renderWithI18nAndToast(<UserCreateForm />);

    const username = screen.getByLabelText(/username/i);
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);
    const submit = screen.getByRole("button", { name: /add/i });

    await userEvent.type(username, "ange");
    await userEvent.type(email, "ange@example.com");
    await userEvent.type(password, "StrongPassw0rd!");
    await userEvent.click(submit);

    // Toast defaultMessage is "User created!" (since key not in en.json)
    const toast = await screen.findByText(/user created!/i);
    expect(toast).toBeInTheDocument();

    // Fields are reset after success
    expect(username).toHaveValue("");
    expect(email).toHaveValue("");
    expect(password).toHaveValue("");
  });
});
