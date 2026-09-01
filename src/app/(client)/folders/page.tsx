import { FolderServices } from "@/services/folders.service";
import Folder from "./_components/layout/Folder";
import { getSession } from "@/lib/session";
import EmptyFolders from "./_components/layout/EmptyFolder";
import { FolderType } from "./types/types";

export default async function page() {
  const session = await getSession();
  const userId = session?.user.id || "";
  const folders: FolderType[] = await FolderServices.getAll(userId);
  return (
    <>{folders.length > 0 ? <Folder folders={folders} /> : <EmptyFolders />}</>
  );
}
