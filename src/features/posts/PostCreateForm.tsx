// src\features\posts\PostCreateForm.tsx

import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useToast } from "@nihil_frontend/contexts/ToastContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@nihil_frontend/api/posts";

export default function PostCreateForm() {
  const [form, setForm] = useState({ userId: "", content: "" });
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      toast.show({ severity: "success", summary: "Post created!" });
      setForm({ userId: "", content: "" });
      await qc.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err: unknown) => {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message)
          : "Failed";
      toast.show({ severity: "error", summary: "Error", detail: msg });
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(form);
  }

  return (
    <form className="flex items-end gap-2" onSubmit={handleSubmit}>
      <span>
        <label className="block text-sm">
          User ID
          <InputText
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
          />
        </label>
      </span>
      <span>
        <label className="block text-sm">
          Content
          <InputText
            name="content"
            value={form.content}
            onChange={handleChange}
            required
          />
        </label>
      </span>
      <Button
        type="submit"
        label={isPending ? "Posting..." : "Post"}
        disabled={isPending}
      />
    </form>
  );
}
