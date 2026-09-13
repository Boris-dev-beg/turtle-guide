"use client";

// import { HelpBox } from "@/app/(client)/(user)/diagnostic/_components/cards/HelpBox";
// import { Back } from "@/components/shared/links";
import { useFolderStore } from "@/store/folder.store";
// import {
//   FileText,
//   Link2,
// } from "lucide-react";
import { DiagnosticLoading } from "../states/Loaders";
import { useFolder } from "@/hooks/useFolder";
import { DiagnosticError } from "../states/Errors";
import { DiagnosticCreated } from "../Pages/DiagnosticCreated";
import { DiagnosticExisting } from "../Pages/DiagnosticExisting";
import { DiagnosticCompleted } from "../Pages/DiagnosticCompleted";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
};

// const TakenSteps = [
//   {
//     id: 1,
//     question: "Votre situation",
//     answer: "Déclarer une naissance",
//   },
//   {
//     id: 2,
//     question: "Lieu de naissance",
//     answer: "Au cameroun",
//   },
//   {
//     id: 3,
//     question: "Délai de déclaration",
//     answer: "Moins de 30 jours",
//   },
//   {
//     id: 4,
//     question: "Lieu de naissance détaillé",
//     answer: "Dans une formation sanitaire",
//   },
//   {
//     id: 5,
//     question: "Qui fait la déclaration ?",
//   },
// ];

export default function Diagnostic({ user }: { user: User }) {
  // ! states
  const router = useRouter();
  const { procedure, category } = useFolderStore();

  const { useCreateOrGetFolder } = useFolder(user.id);

  // ! Functions
  // ? Initialisation of te folder
  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useCreateOrGetFolder({ procedureName: procedure, category });

  // const handleStartDiagnostic = () => {
  //   return null;
  // };
  // const handleRetry = async () => {
  //   if (!user.id || !procedure || !category) return;

  //   try {
  //     setIsRetrying(true);
  //     setInitializationError(null);

  //     const result = await createOrGetFolderAsync({
  //       procedureName: procedure,
  //       userId: user.id,
  //       category,
  //     });

  //     setFolder(result.folder);
  //   } catch (error) {
  //     console.error("Erreur lors de la nouvelle tentative :", error);

  //     setInitializationError(
  //       error instanceof Error ? error : new Error("Une erreur est survenue."),
  //     );
  //   } finally {
  //     setIsRetrying(false);
  //   }
  // };

  // ! Render
  console.log("result:", result)
  // ? Loading
  if (isLoading) return <DiagnosticLoading />;

  // ? Error
  if (isError || error)
    return <DiagnosticError onRetry={refetch} isRetrying={isRefetching} />;

  // ? Everything is OK
  if (result?.status === "CREATED") {
    return (
      <DiagnosticCreated
        folder={result.folder}
        onStart={() => {
          // ici tu passes réellement à la première question
        }}
      />
    );
  }

  if (result?.status === "EXISTING_ACTIVE") {
    return (
      <DiagnosticExisting
        folder={result.folder}
        onContinue={() => {
          // Reprendre le diagnostic
        }}
      />
    );
  }

  if (result?.status === "EXISTING_COMPLETED") {
    return (
      <DiagnosticCompleted
        folder={result.folder}
        onViewFolder={() => {
          router.push(`/dossiers/${result.folder.id}`);
        }}
        onRestart={() => {
          // supprimer l'ancien dossier
          // puis créer un nouveau diagnostic
        }}
      />
    );
  }
  return (
    <></>
    // <>
    //   {/* First Side */}
    //   <FirstSide
    //     procedure={procedure}
    //     handleStartDiagnostic={handleStartDiagnostic}
    //   />

    //   {/* Question side */}
    //   <QuestionsSide userId={user.id} folderId={folder?.id || ""} />

    //   {/* Great to know */}
    //   <div className="turtle-alert-info max-[1200px]:hidden flex-col items-start h-fit w-full lg:w-100 shadow-sm">
    //     <span className="flex gap-2 items-center">
    //       <Lightbulb className="p-2 size-7 rounded-full bg-primary/10 text-primary" />
    //       <h2 className="font-bold text-lg"> Bon à savoir </h2>
    //     </span>
    //     <p className="text-muted-foreground text-sm leading-6">
    //       La déclaration doit être faite dans les 90 jours suivant la naissance
    //       pour éviter les démarches plus complexes.
    //     </p>
    //     <Link
    //       href={"/"}
    //       className="hover:underline text-primary font-semibold flex items-center gap-2 text-sm transition-colors"
    //     >
    //       Lire la loi n°2024/016
    //       <ArrowUpRightFromSquare className="size-4" />
    //     </Link>
    //   </div>
    // </>
  );
}

// const FirstSide = ({
//   procedure,
//   handleStartDiagnostic,
// }: {
//   procedure: string;
//   handleStartDiagnostic: () => void;
// }) => {
//   return (
//     <div className="h-fit lg:h-full w-full md:w-120 flex flex-col gap-4 py-4 px-2 border-r border-border bg-secondary/20 rounded-xl">
//       {/* Back to home */}
//       <Back href="/categories" />

//       <button
//         type="button"
//         onClick={handleStartDiagnostic}
//         className="btn btn-primary"
//       >
//         Commencer le diagnostic
//       </button>

//       {/* Selected Procedure */}
//       <div className="flex gap-3 items-start py-3 px-2 rounded-xl bg-background shadow-xs">
//         <span className="flex items-center justify-center size-10 shrink-0 bg-primary/10 text-primary rounded-lg">
//           <FileText className="size-5" />
//         </span>
//         <span className="w-full leading-4">
//           <h1 className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
//             Procédure sélectionnée
//           </h1>
//           <h2 className="font-bold line-clamp-2 leading-6">{procedure}</h2>
//         </span>
//       </div>

//       {/* Steps Taken */}
//       <div className="hidden md:flex flex-col gap-3">
//         <h1 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
//           <Link2 className="size-4 text-primary" /> Étapes parcourues
//         </h1>
//         {/* Steps */}
//         <div className="flex flex-col gap-1 pl-1">
//           {TakenSteps.map((step, index) => (
//             <div className="flex gap-3 w-full" key={index}>
//               <span className="flex flex-col items-center gap-2 text-muted-foreground justify-start">
//                 <span
//                   className={`turtle-step ${step.answer ? "turtle-step-active" : "turtle-step-inactive"} w-5 h-5 ring-2 ring-background`}
//                 />
//                 {step.answer && <p className="h-6 border-l-2 border-border" />}
//               </span>
//               <div className="flex flex-col mb-auto pb-2">
//                 <h1
//                   className={`font-semibold ${step.answer ? "text-foreground" : "text-primary"}`}
//                 >
//                   {step.id}. {step.question}
//                 </h1>
//                 {step.answer && (
//                   <p className="text-muted-foreground text-sm mt-0.5 leading-5">
//                     {step.answer}
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Help Box */}
//       <HelpBox />
//     </div>
//   );
// };
