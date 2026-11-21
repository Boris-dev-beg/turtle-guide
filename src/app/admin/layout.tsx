import Header from "./_components/layouts/Header";
import SideBar from "./_components/layouts/SideBar";
import {
  AdminAuthorizationError,
  requireAdmin,
} from "@/lib/admin/require-admin";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await requireAdmin().catch((error: unknown) => {
    if (
      error instanceof AdminAuthorizationError &&
      error.code === "UNAUTHENTICATED"
    ) {
      redirect("/login?callbackUrl=%2Fadmin");
    }
    if (
      error instanceof AdminAuthorizationError &&
      error.code === "NOT_ADMIN"
    ) {
      redirect("/");
    }
    throw error;
  });

  return (
    <div className="flex max-w-full w-screen  *:**:font-display">
      <SideBar />
      <main className="flex w-full flex-col">
        <Header
          name={session?.user.name || "Administrateur"}
          email={session?.user.email || ""}
        />
        <section className="w-full p-4 sm:p-6">{children}</section>
      </main>
    </div>
  );
}
