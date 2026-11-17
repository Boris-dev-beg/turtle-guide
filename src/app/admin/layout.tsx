import Header from "./_components/layouts/Header";
import SideBar from "./_components/layouts/SideBar";
import { getSession } from "@/lib/session";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

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
