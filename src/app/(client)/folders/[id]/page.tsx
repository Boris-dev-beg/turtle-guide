import { FolderServices } from "@/services/folders.service";
import FolderDetail from "../_components/layout/FolderDetail";
import { getSession } from "@/lib/session";
import PendingFolder from "./PendingFolder";
import { notFound } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const userId = session?.user.id || "";
  // const folders = await FolderServices.getAll(userId);
  const folder = await FolderServices.getOneFolder(id, userId);
  console.log("Folder:", folder);
  if (!folder) {
    notFound();
  }
  return (
    <div className="w-full ">
      {folder.status === "CREATED" ? (
        <FolderDetail folder={folder} userId={userId} />
      ) : (
        <PendingFolder />
      )}
    </div>
  );
}
