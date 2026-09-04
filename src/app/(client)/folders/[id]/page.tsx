import { FolderServices } from "@/services/folders.service";
import FolderDetail from "../_components/layout/FolderDetail";
import { getSession } from "@/lib/session";
import PendingFolder from "./PendingFolder";
import { notFound } from "next/navigation";
import { FolderType } from "../types/types";
import { questionServices } from "@/services/question.service";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const userId = session?.user.id || "";
  const folder: FolderType | null = await FolderServices.getOneFolder(
    id,
    userId,
  );
  console.log("Folder:", folder);
  if (!folder) {
    notFound();
  }
  const answers = await questionServices.getAnswers(folder.id);

  console.log("Answer for this folder:", answers, folder.name);
  return (
    <div className="w-full ">
      {folder.status === "CREATED" ? (
        <FolderDetail folder={folder} userId={userId} />
      ) : (
        <PendingFolder folder={folder} userId={userId} />
      )}
    </div>
  );
}
