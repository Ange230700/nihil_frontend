// src\features\users\UserCreateForm.tsx

import { isAxiosError } from "axios";
import { isServerErrorData } from "@nihil_frontend/shared/forms/serverError";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useToast } from "@nihil_frontend/contexts/ToastContext";
import { userApi } from "@nihil_frontend/api/api";
import { Field } from "@nihil_frontend/shared/forms/Field";
import { applyZodIssuesToForm } from "@nihil_frontend/shared/forms/applyZodIssues";
import {
  UserCreateSchema,
  type UserCreateInput,
} from "@nihil_frontend/entities/user/validation";
import { swallow } from "@nihil_frontend/shared/utils/swallow";

export default function UserCreateForm({
  onCreated,
}: Readonly<{ onCreated?: () => void }>) {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<UserCreateInput>({
    resolver: zodResolver(UserCreateSchema),
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await userApi.post("/users", data);
      toast.show({ severity: "success", summary: "User created!" });
      reset();
      onCreated?.();
    } catch (err: unknown) {
      // ✅ Safely extract issues (no `any`)
      const issues =
        isAxiosError(err) && isServerErrorData(err.response?.data)
          ? err.response.data.error?.issues
          : undefined;

      applyZodIssuesToForm<UserCreateInput>(issues, setError);

      // ✅ Safe message extraction
      const message =
        ((isAxiosError(err) &&
          isServerErrorData(err.response?.data) &&
          err.response.data.error?.message) ??
          (err instanceof Error && err.message)) ||
        "Request failed";

      toast.show({ severity: "error", summary: "Error", detail: message });
    }
  });

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={swallow(onSubmit)}
      noValidate
    >
      <Field id="username" label="Username" error={errors.username?.message}>
        <InputText
          id="username"
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
          disabled={isSubmitting}
          {...register("username")}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email?.message}>
        <InputText
          id="email"
          type="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          disabled={isSubmitting}
          {...register("email")}
        />
      </Field>

      <Field id="password" label="Password" error={errors.password?.message}>
        <InputText
          id="password"
          type="password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          disabled={isSubmitting}
          {...register("password")}
        />
      </Field>

      <Button
        type="submit"
        label={isSubmitting ? "Adding..." : "Add"}
        disabled={isSubmitting || !isDirty || !isValid}
      />
    </form>
  );
}
