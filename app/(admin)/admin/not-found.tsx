import Link from "next/link";
import { admin } from "@/content/admin";

export default function AdminNotFound() {
  return (
    <main className="site-container flex-1 py-16">
      <h1 className="text-3xl">{admin.notFound.title}</h1>
      <p className="mt-4">
        <Link href="/admin">{admin.notFound.back}</Link>
      </p>
    </main>
  );
}
