// src\features\users\UserCreateForm.tsx

import { useState } from "react";
import { userApi } from "@nihil_frontend/api/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useToast } from "@nihil_frontend/contexts/ToastContext";
import { mapApiError } from "@nihil_frontend/shared/api/mapApiError";

export default function UserCreateForm({
  onCreated,
}: Readonly<{
  onCreated?: () => void;
}>) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await userApi.post("/users", form);
      toast.show({
        severity: "success",
        summary: "Success",
        detail: "User created!",
      });
      setForm({ username: "", email: "", password: "" });
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
          Username
          <InputText
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>
      </span>
      <span>
        <label className="block text-sm">
          Email
          <InputText
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
      </span>
      <span>
        <label className="block text-sm">
          Password
          <InputText
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
      </span>
      <Button
        type="submit"
        label={loading ? "Adding..." : "Add"}
        disabled={loading}
      />
    </form>
  );
}
