"use server";

import { FolderServices } from "@/services/folders.service";
import { proceduresServices } from "@/services/procedure.service";

// ! CREATE Folder
export async function createOrGetFolderAction({
  procedureName,
  userId,
  category,
}: {
  procedureName: string;
  userId: string;
  category: string;
}) {
  const folderExist = await FolderServices.getOne({
    name: category,
    userId,
  });

  if (folderExist) {
    return folderExist;
  }

  const procedure = await proceduresServices.getOne(procedureName);

  if (!procedure) {
    throw new Error("Procédure introuvable");
  }

  const newFolder = await FolderServices.createFolder({
    userId,
    name: category,
    procedureId: procedure.id,
  });

  return newFolder;
}

// ! GET Folder
export async function getFolders(userId: string) {
  return await FolderServices.getAll(userId);
}

// ! UPDATE folder status
export async function updateFolderStatus(data: {
  id: string;
  userId: string;
  processId: string;
  status: "CREATED" | "PENDING" | "CLOSED" | "ENDED";
}) {
  return await FolderServices.updateFolder(data);
}

// ! Delete folder
export async function deleteFolder(id: string, userId: string) {
  const FolderDeleted = await FolderServices.deleteFolder(id, userId);

  console.log("Deleted Folder:", FolderDeleted);
  return FolderDeleted;
}
