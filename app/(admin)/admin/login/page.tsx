import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { admin } from "@/content/admin";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: admin.login.title };

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.active) redirect("/admin");
  return (
    <main className="grid flex-1 place-items-center bg-mist px-4 py-12">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-card">
        <p className="font-heading text-xl font-bold tracking-wide text-graphite">KINZOKU</p>
        <h1 className="mt-2 text-2xl">{admin.login.title}</h1>
        <LoginForm />
      </div>
    </main>
  );
}
