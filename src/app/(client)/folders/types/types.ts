import { Folder, Location, Procedure, Process, Progression } from "@/generated/prisma/client";

export type FolderType = {
  procedure: Procedure;
  location: Location | null;
  progression: Progression | null;
  process: Process | null;
} & Folder;
