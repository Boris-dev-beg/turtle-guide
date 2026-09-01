import { Folder, Location, Procedure } from "@/generated/prisma/client";

export type FolderType = {
  procedure: Procedure;
  location: Location | null;
} & Folder;
