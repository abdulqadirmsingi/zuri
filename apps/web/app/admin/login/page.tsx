import { notFound } from "next/navigation";
import { isAdminConfigured } from "@/lib/admin/auth";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  if (!isAdminConfigured(process.env.ADMIN_TOKEN)) notFound();
  return (
    <main className="mx-auto mt-24 max-w-sm">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Admin sign in</h1>
      <LoginForm />
    </main>
  );
}
