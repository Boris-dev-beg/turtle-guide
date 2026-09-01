"use server";

import { FolderServices } from "@/services/folders.service";
import { proceduresServices } from "@/services/procedure.service";

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