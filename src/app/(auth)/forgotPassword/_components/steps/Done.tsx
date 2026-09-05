import { Check, Home, LogIn } from "lucide-react"; 
import Link from "next/link"; 

export default function Done() { 
  return ( 
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"> 
      {/* Icône */} 
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50"> 
        <Check className="size-10" /> 
      </div> 

      {/* Titre */} 
      <div className="mb-6 text-center"> 
        <h1 className="text-3xl font-bold text-slate-800">C&apos;est fait !</h1> 

        <p className="mt-3 leading-6 text-slate-500"> 
          Votre mot de passe à étè mis à jour avec succés. 
        </p> 
      </div> 

      <div className="space-y-5"> 
        <Link 
          href="/login" 
          className="btn btn-primary flex h-12 w-full items-center justify-center gap-2 text-base" 
        > 
          <LogIn className="size-5" strokeWidth={2} /> 
          Se connecter 
        </Link> 
        <Link 
          href="/" 
          className="btn btn-outline text-base flex h-12 w-full items-center justify-center gap-2" 
        > 
          <Home className="size-5" strokeWidth={2} /> 
          Retour à l&apos;acceuil 
        </Link> 
      </div> 
    </div> 
  ); 
} 
