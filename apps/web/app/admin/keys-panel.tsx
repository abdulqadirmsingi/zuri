"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

export interface KeyRow {
  id: number;
  keyPrefix: string;
  customerRef: string;
  status: string;
  createdAt: string;
}

const button =
  "min-h-10 rounded-md px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50";

async function post(url: string, body?: unknown) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function KeysPanel({ keys }: { keys: KeyRow[] }) {
  const router = useRouter();
  const id = useId();
  const [created, setCreated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [pending, setPending] = useState(false);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setError(null);
    const res = await post("/api/admin/keys", {
      customerRef: new FormData(form).get("customerRef"),
    });
    setPending(false);
    if (!res.ok) return setError("Could not create the key.");
    setCreated(((await res.json()) as { key: string }).key);
    form.reset();
    router.refresh();
  }

  async function revoke(keyId: number) {
    setPending(true);
    const res = await post(`/api/admin/keys/${keyId}/revoke`);
    setPending(false);
    setConfirming(null);
    if (!res.ok) return setError("Could not revoke the key.");
    router.refresh();
  }

  return (
    <section
      aria-labelledby={`${id}-h`}
      className="zuri-glass grid grid-cols-1 gap-4 rounded-lg p-4"
    >
      <h2 id={`${id}-h`} className="font-display text-base font-semibold">
        Pro licence keys
      </h2>

      <form onSubmit={create} className="flex flex-wrap items-end gap-3">
        <div className="grid gap-1">
          <label htmlFor={`${id}-ref`} className="text-sm font-medium">
            Customer reference
          </label>
          <input
            id={`${id}-ref`}
            name="customerRef"
            required
            maxLength={128}
            className="min-h-10 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className={`${button} bg-primary text-primary-foreground`}
        >
          Create key
        </button>
      </form>

      <div role="status" aria-live="polite">
        {created && (
          <p className="rounded-md border border-border bg-muted p-3 text-sm">
            Copy this key now. It is shown once and cannot be retrieved later.
            <code className="mt-2 block break-all font-mono text-xs">{created}</code>
          </p>
        )}
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Licence keys</caption>
          <thead>
            <tr className="text-start text-muted-foreground">
              {["Key", "Customer", "Status", "Created", ""].map((h) => (
                <th key={h || "actions"} scope="col" className="px-2 py-2 text-start font-medium">
                  {h || <span className="sr-only">Actions</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 && (
              <tr>
                <td colSpan={5} className="px-2 py-2 text-muted-foreground">
                  No keys yet.
                </td>
              </tr>
            )}
            {keys.map((k) => (
              <tr key={k.id} className="border-t border-border">
                <td className="px-2 py-2 font-mono text-xs">{k.keyPrefix}…</td>
                <td className="px-2 py-2">{k.customerRef}</td>
                <td className="px-2 py-2">{k.status === "active" ? "Active" : "Revoked"}</td>
                <td className="px-2 py-2 tabular-nums">{k.createdAt.slice(0, 10)}</td>
                <td className="px-2 py-2 text-end">
                  {k.status === "active" &&
                    (confirming === k.id ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => revoke(k.id)}
                        className={`${button} bg-danger text-primary-foreground`}
                      >
                        Confirm revoke {k.keyPrefix}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirming(k.id)}
                        className={`${button} border border-border`}
                      >
                        Revoke<span className="sr-only"> {k.keyPrefix}</span>
                      </button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
