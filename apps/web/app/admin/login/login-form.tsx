"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

// method=post: if the form is submitted before hydration, the token must never end up in the URL.
export function LoginForm() {
  const router = useRouter();
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const token = new FormData(event.currentTarget).get("token");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) return router.replace("/admin");
      setError(
        res.status === 429 ? "Too many attempts. Wait a minute." : "That token is not valid.",
      );
    } catch {
      setError("Could not reach the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      method="post"
      action="/api/admin/login"
      onSubmit={onSubmit}
      className="zuri-glass mt-6 grid gap-4 rounded-lg p-6"
    >
      <label htmlFor={id} className="text-sm font-medium">
        Admin token
      </label>
      <input
        id={id}
        name="token"
        type="password"
        autoComplete="off"
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-10 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      <p id={`${id}-error`} role="alert" className="min-h-5 text-sm text-danger">
        {error}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="min-h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
