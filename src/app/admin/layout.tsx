import Header from "./_components/layouts/Header";
import SideBar from "./_components/layouts/SideBar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=%2Fadmin%2Ffraud-alerts");

  // const administrator = await prisma.administrator.findUnique({
  //   where: { userId: session.user.id },
  //   select: { id: true },
  // });
  // if (!administrator) notFound();

  return (
    <div className="flex max-w-full w-screen  *:**:font-display">
      <SideBar />
      <main className="flex w-full flex-col">
        <Header
          name={session?.user.name || "Administrateur"}
          email={session?.user.email || ""}
        />
        {children}
      </main>
    </div>
  );
}
