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
import { useIntl } from "react-intl";

export default function UserCreateForm({
  onCreated,
}: Readonly<{ onCreated?: () => void }>) {
  const toast = useToast();
  const intl = useIntl();
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
      toast.show({
        severity: "success",
        summary: intl.formatMessage({
          id: "users.created",
          defaultMessage: "User created!",
        }),
      });
      reset();
      onCreated?.();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const payload: unknown = err.response?.data;

        if (isServerErrorData(payload)) {
          const issues = payload.error?.issues;
          applyZodIssuesToForm<UserCreateInput>(issues, setError);

          const message =
            typeof payload.error?.message === "string"
              ? payload.error.message
              : intl.formatMessage({
                  id: "common.requestFailed",
                  defaultMessage: "Request failed",
                });

          toast.show({
            severity: "error",
            summary: intl.formatMessage({
              id: "common.error",
              defaultMessage: "Error",
            }),
            detail: message,
          });
          return;
        }
      }

      const fallbackMessage =
        (err instanceof Error && err.message) ||
        intl.formatMessage({
          id: "common.requestFailed",
          defaultMessage: "Request failed",
        });

      toast.show({
        severity: "error",
        summary: intl.formatMessage({
          id: "common.error",
          defaultMessage: "Error",
        }),
        detail: fallbackMessage,
      });
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
        label={
          isSubmitting
            ? intl.formatMessage({
                id: "users.adding",
                defaultMessage: "Adding...",
              })
            : intl.formatMessage({ id: "users.add", defaultMessage: "Add" })
        }
        disabled={isSubmitting || !isDirty || !isValid}
      />
    </form>
  );
}
