// src\features\posts\PostCreateForm.tsx

import { useState } from "react";
import { postApi } from "@nihil_frontend/api/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useToast } from "@nihil_frontend/contexts/ToastContext";
import { mapApiError } from "@nihil_frontend/shared/api/mapApiError";

export default function PostCreateForm({
  onCreated,
}: Readonly<{
  onCreated?: () => void;
}>) {
  const [form, setForm] = useState({ userId: "", content: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await postApi.post("/posts", form);
      toast.show({
        severity: "success",
        summary: "Success",
        detail: "Post created!",
      });
      setForm({ userId: "", content: "" });
      onCreated?.();
    } catch (err: unknown) {
      const { severity, summary, detail } = mapApiError(err);
      toast.show({ severity, summary, detail });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="flex items-end gap-2"
      onSubmit={handleSubmit as unknown as (e: React.FormEvent) => void}
    >
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
        label={loading ? "Posting..." : "Post"}
        disabled={loading}
      />
    </form>
  );
}
