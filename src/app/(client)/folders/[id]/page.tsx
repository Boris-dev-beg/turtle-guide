
import { FolderServices } from "@/services/folders.service";
import FolderDetail from "../_components/layout/FolderDetail";

export default async function page() {
  const folders = await FolderServices.getAll();
  return (
    <div className="w-full ">
      <FolderDetail folder={folders[0]} />
    </div>
  );
}
