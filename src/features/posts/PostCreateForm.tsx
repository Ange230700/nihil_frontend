// src\features\posts\PostCreateForm.tsx

import { isAxiosError } from "axios";
import { isServerErrorData } from "@nihil_frontend/shared/forms/serverError";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useToast } from "@nihil_frontend/contexts/ToastContext";
import { postApi } from "@nihil_frontend/api/api";
import { Field } from "@nihil_frontend/shared/forms/Field";
import { applyZodIssuesToForm } from "@nihil_frontend/shared/forms/applyZodIssues";
import {
  PostCreateSchema,
  type PostCreateInput,
} from "@nihil_frontend/entities/post/validation";

export default function PostCreateForm({
  onCreated,
}: Readonly<{ onCreated?: () => void }>) {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<PostCreateInput>({
    resolver: zodResolver(PostCreateSchema),
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await postApi.post("/posts", data);
      toast.show({ severity: "success", summary: "Post created!" });
      reset();
      onCreated?.();
    } catch (err: unknown) {
      // ✅ Safely extract issues (no `any`)
      const issues =
        isAxiosError(err) && isServerErrorData(err.response?.data)
          ? err.response.data.error?.issues
          : undefined;
      applyZodIssuesToForm<PostCreateInput>(issues, setError);

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
      onSubmit={(e) => {
        void onSubmit(e);
      }}
      noValidate
    >
      <Field id="userId" label="User ID" error={errors.userId?.message}>
        <InputText
          id="userId"
          aria-invalid={!!errors.userId}
          aria-describedby={errors.userId ? "userId-error" : undefined}
          disabled={isSubmitting}
          {...register("userId")}
        />
      </Field>

      <Field id="content" label="Content" error={errors.content?.message}>
        <InputText
          id="content"
          aria-invalid={!!errors.content}
          aria-describedby={errors.content ? "content-error" : undefined}
          disabled={isSubmitting}
          {...register("content")}
        />
      </Field>

      <Button
        type="submit"
        label={isSubmitting ? "Posting..." : "Post"}
        disabled={isSubmitting || !isDirty || !isValid}
      />
    </form>
  );
}
