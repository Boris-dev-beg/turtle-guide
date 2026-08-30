import { FolderServices } from "@/services/folders.service";
import Folder from "./_components/layout/Folder";
// import { getSession, requireSession } from "@/lib/session";

export default async function page() {
  // const session = await getSession();
  // const userId = session?.user.id || "";
  const folders = await FolderServices.getAll();
  return (
    <section className="wrapper flex w-full">
      <Folder folders={folders} />
    </section>
  );
}
