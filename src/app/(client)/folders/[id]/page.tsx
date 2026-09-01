
import { FolderServices } from "@/services/folders.service";
import FolderDetail from "../_components/layout/FolderDetail";
import { getSession } from "@/lib/session";
import PendingFolder from "./PendingFolder";

export default async function page() {
  const session = await getSession();
  const userId = session?.user.id || "";
  const folders = await FolderServices.getAll(userId);
  return (
    <div className="w-full ">
      <PendingFolder />
      {/* <FolderDetail folder={folders[0]} /> */}
    </div>
  );
}
