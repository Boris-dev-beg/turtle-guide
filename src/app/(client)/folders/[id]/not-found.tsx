import Link from "next/link"; 
import { ArrowLeft, FolderX } from "lucide-react"; 

export default function NotFound() { 
  return ( 
    <main className="wrapper flex min-h-[60vh] items-center justify-center py-12"> 
      <div className="max-w-md text-center"> 
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted"> 
          <FolderX className="h-7 w-7 text-muted-foreground" /> 
        </div> 

        <h1 className="text-2xl font-bold"> 
          Dossier introuvable 
        </h1> 

        <p className="mt-3 text-muted-foreground"> 
          Le dossier que vous recherchez n&apos;existe pas ou vous n&apos;avez pas 
          accès à celui-ci. 
        </p> 

        <Link href="/folder" className="btn btn-primary mt-6"> 
          <ArrowLeft className="h-4 w-4" /> 
          Retour à mes dossiers 
        </Link> 
      </div> 
    </main> 
  ); 
} 