"use server";

import { FolderStatus } from "@/generated/prisma/enums";
import { FolderServices } from "@/services/folders.service";
import { LocationServices } from "@/services/location.service";
import { proceduresServices } from "@/services/procedure.service";
import { requireSession } from "@/lib/session";

// ! CREATE OR GET Folder
export async function createOrGetFolderAction({
  procedureName,
  userId,
  category,
}: {
  procedureName: string;
  userId: string;
  category: string;
}) {
  const procedure = await proceduresServices.getOne(procedureName);

  if (!procedure) {
    throw new Error("Procédure introuvable");
  }

  return await FolderServices.getOrCreateDiagnosticFolder({
    userId,
    procedureId: procedure.id,
    name: category + " - " + procedureName,
  });
}

// ! GET Folders
export async function getFolders(userId: string) {
  return await FolderServices.getAll(userId);
}

// ! GET one folder
export async function getFolder(id: string, userId: string) {
  return await FolderServices.getOneFolder(id, userId);
}

// ! UPDATE folder status
export async function updateFolderStatus(data: {
  id: string;
  userId: string;
  processId: string;
  status: FolderStatus;
}) {
  return await FolderServices.updateFolder(data);
}

// ! UPDATE FOlDER Location
export async function updateFolderLocation(data: {
  id: string;
  userId: string;
  locationName: string;
}) {
  const location = await LocationServices.getOneByName(data.locationName);

  return await FolderServices.updateFolderLocation({
    ...data,
    locationId: location.id,
  });
}

// ! UPDATE FOlDER Progression
export async function updateFolderProgression(data: {
  id: string;
  userId: string;
  progressionId: string;
}) {
  return await FolderServices.updateFolderProgression(data);
}

export async function restartFolderDiagnostic(folderId: string) {
  const session = await requireSession();

  return FolderServices.resetDiagnostic({
    id: folderId,
    userId: session.user.id,
  });
}

// ! Delete folder
export async function deleteFolder(id: string, userId: string) {
  const FolderDeleted = await FolderServices.deleteFolder(id, userId);

  console.log("Deleted Folder:", FolderDeleted);
  return FolderDeleted;
}
