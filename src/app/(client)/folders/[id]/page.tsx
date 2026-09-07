import { FolderServices } from "@/services/folders.service";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { FolderType } from "../types/types";
import FolderDetailsPage from "../_components/layout/FolderDetails";

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
  if (!folder) {
    notFound();
  }

  return (
    <div className="w-full ">
      <FolderDetailsPage id={id} userId={userId} />
    </div>
  );
}
