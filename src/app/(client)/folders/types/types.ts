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
  administrativeBody:
    | (AdministrativeBody & {
        administrativeUnits: {
          id: string;
          name: string;
          location: Location;
        }[];
      })
    | null;
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
  process: ProcessType | null;
  answers: {
    id: string;
    answeredAt: Date;
    option: {
      id: string;
      label: string;
      question: {
        id: string;
        title: string;
      };
    };
  }[];
  progression:
    | (Progression & {
        currentQuestion: {
          id: string;
          title: string;
          description: string | null;
        };
      })
    | null;
};

export type FolderListType = Pick<
  Folder,
  "id" | "name" | "status" | "createdAt" | "updatedAt"
> & {
  procedure: Pick<Procedure, "title"> & {
    category: Pick<Category, "name">;
  };
  location: Pick<Location, "city" | "address"> | null;
  progression: Progression | null;
};
