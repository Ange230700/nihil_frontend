// src\features\users\UserCreateForm.tsx

import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useToast } from "@nihil_frontend/contexts/ToastContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@nihil_frontend/api/users";

export default function UserCreateForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const toast = useToast();
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      toast.show({ severity: "success", summary: "User created!" });
      setForm({ username: "", email: "", password: "" });
      await qc.invalidateQueries({ queryKey: ["users"] });
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
        label={isPending ? "Adding..." : "Add"}
        disabled={isPending}
      />
    </form>
  );
}
