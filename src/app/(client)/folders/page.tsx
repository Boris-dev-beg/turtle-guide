import { FolderServices } from "@/services/folders.service";
import Folder from "./_components/layout/Folder";
import { getSession } from "@/lib/session";
import EmptyFolders from "./_components/layout/EmptyFolder";

export default async function page() {
  const session = await getSession();
  const userId = session?.user.id || "";
  const folders = await FolderServices.getAll(userId);
  return (
    <>{folders.length > 0 ? <Folder folders={folders} /> : <EmptyFolders />}</>
  );
}
