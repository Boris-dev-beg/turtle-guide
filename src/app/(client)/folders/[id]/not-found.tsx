import Link from "next/link"; 
import { ArrowLeft, FolderX } from "lucide-react"; 

export default function NotFound() { 
  return ( 
    <main className="wrapper flex min-h-[60vh] items-center justify-center py-12"> 
      <div className="max-w-md text-center"> 
        <div className="mx-auto mb-5 flex items-center justify-center rounded-full"> 
          <FolderX className="size-16 text-muted-foreground" /> 
        </div> 

        <h1 className="text-4xl font-bold"> 
          Dossier introuvable 
        </h1> 

        <p className="mt-3 text-lg text-muted-foreground"> 
          Le dossier que vous recherchez n&apos;existe pas ou vous n&apos;avez pas 
          accès à celui-ci. 
        </p> 

        <Link href="/folders" className="btn btn-primary py-4 text-base mt-6"> 
          <ArrowLeft className="size-5" /> 
          Retour à mes dossiers 
        </Link> 
      </div> 
    </main> 
  ); 
} 