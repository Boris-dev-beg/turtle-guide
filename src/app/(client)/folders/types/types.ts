import {
  AdministrativeBody,
  Category,
  Document,
  Folder,
  FraudAlert,
  Location,
  Procedure,
  Progression,
} from "@/generated/prisma/client";

export type Step = {
  id: string;
  title: string;
  description: string;
  processId: string;
  administrativeBodyId: string | null;
  administrativeBody: AdministrativeBody | null;
  documents: Document[];
  fraudAlerts: FraudAlert[];
};

export type ProcessType = {
  id: string;
  title: string;
  description: string;
  steps: Step[];
};

export type FolderType = Folder & {
  procedure: Procedure & {
    category: Category;
  };
  location: Location | null;
  progression: Progression | null;
  process: ProcessType | null;
};