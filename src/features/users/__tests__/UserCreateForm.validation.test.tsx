// src\features\users\__tests__\__tests__\UserCreateForm.validation.test.tsx

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@nihil_frontend/tests/msw/server";
import { renderWithI18nAndToast } from "@nihil_frontend/tests/utils/renderWithI18nAndToast";
import UserCreateForm from "@nihil_frontend/features/users/UserCreateForm";

// Return a backend-shaped error: { error: { message, issues: [...] } }
const postUsersValidationError = http.post(/\/users$/, () => {
  return HttpResponse.json(
    {
      error: {
        message: "Invalid input",
        issues: [
          { path: ["username"], message: "Username already taken" },
          { path: ["email"], message: "Email already registered" },
          // (you could include more paths; form maps [0] to field)
        ],
      },
    },
    { status: 400 },
  );
});

describe("UserCreateForm - server validation", () => {
  it("renders field errors from server issues and shows error toast", async () => {
    server.use(postUsersValidationError);

    renderWithI18nAndToast(<UserCreateForm />);

    const username = screen.getByLabelText(/username/i);
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);
    const submit = screen.getByRole("button", { name: /add/i });

    // Enter values that pass client zod, so we hit server
    await userEvent.type(username, "ange");
    await userEvent.type(email, "ange@example.com");
    await userEvent.type(password, "StrongPassw0rd!");
    await userEvent.click(submit);

    // Field-level errors (your Field renders <small role="alert">)
    expect(
      await screen.findByRole("alert", { name: /username/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/username already taken/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/email already registered/i),
    ).toBeInTheDocument();

    // Toast shows generic "Error" summary with server message as detail
    expect(await screen.findByText(/^error$/i)).toBeInTheDocument();
    expect(await screen.findByText(/invalid input/i)).toBeInTheDocument();
  });
});
