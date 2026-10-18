import { getSession } from "@/lib/session";
import Folders from "./_components/layout/Folders";

export default async function page() {
  const session = await getSession();
  const userId = session?.user.id || "";
  return (
    <>
      <Folders userId={userId} />
    </>
  );
}
