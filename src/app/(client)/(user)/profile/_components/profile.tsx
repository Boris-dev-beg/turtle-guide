"use client"; 
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { useAuth } from "@/hooks/useAuth"; 
import { User } from "better-auth"; 
import Image from "next/image"; 
import Link from "next/link"; 

export default function Profile({ 
  user, 
  hasPassword, 
}: { 
  user: User; 
  hasPassword: boolean; 
}) { 
  const { logout } = useAuth(); 
  return ( 
    <> 
      {/* Identity */} 
      <section className="rounded-2xl border bg-card p-5"> 
        <div className="flex items-center gap-4"> 
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10"> 
            {user.image ? ( 
              <Image 
                src={user.image} 
                alt={user.name} 
                width={100} 
                height={100} 
                className="size-full object-cover" 
              /> 
            ) : ( 
              <span className="font-black uppercase text-primary"> 
                {user.name.slice(0, 2)} 
              </span> 
            )} 
          </div> 

          <div> 
            <h2 className="font-bold text-lg uppercase">{user.name}</h2> 

            <p className="text-muted-foreground">Compte personnel</p> 
          </div> 
        </div> 
      </section> 

      {/* Informations */} 
      <section className="mt-4 rounded-2xl border bg-card p-5"> 
        <div className="mb-5"> 
          <h2 className="font-bold text-lg">Informations</h2> 

          <p className="mt-1 text-muted-foreground"> 
            Les informations utilisées pour votre compte. 
          </p> 
        </div> 

        <div className="space-y-4"> 
          <div> 
            <Label 
              htmlFor="name" 
              className="text-base w-fit font-medium text-muted-foreground" 
            > 
              Nom 
            </Label> 

            <Input 
              id="name" 
              value={user.name} 
              className="mt-1 w-100 border bg-background px-3 py-3 text-base! outline-none focus:ring-2 focus:ring-primary/20" 
            /> 
          </div> 
        </div> 
      </section> 

      {/* Sécurité */} 
      <section className="mt-4 rounded-2xl border bg-card p-5"> 
        <div className="mb-5"> 
          <h2 className="font-bold text-lg">Sécurité</h2> 

          <p className="mt-1 text-muted-foreground"> 
            Gérez votre manière de vous connecter. 
          </p> 
        </div> 

        <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 p-4"> 
          <div> 
            <p className="font-semibold text-lg">Mot de passe</p> 

            <p className="mt-1 text-base text-muted-foreground"> 
              {hasPassword 
                ? "Modifiez votre mot de passe pour sécuriser votre compte." 
                : "Ajoutez un mot de passe pour pouvoir vous connecter avec votre adresse email."} 
            </p> 
          </div> 

          <Link href="/profile/password" className="btn btn-outline text-base"> 
            {hasPassword ? "Modifier" : "Ajouter"} 
          </Link> 
        </div> 
      </section> 

      {/* Zone sensible */} 
      <section className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/3 p-5"> 
        <div className="mb-5"> 
          <h2 className="font-bold text-destructive text-lg">Zone sensible</h2> 

          <p className="mt-1 text-muted-foreground"> 
            Ces actions peuvent affecter l&apos;accès à votre compte. 
          </p> 
        </div> 

        <div className="divide-y divide-destructive/10"> 
          {/* Déconnexion */} 
          <div className="flex items-center justify-between gap-4 py-4 first:pt-0"> 
            <div> 
              <p className="text-base font-semibold">Déconnexion</p> 

              <p className="mt-1 text-sm text-muted-foreground"> 
                Fermer votre session sur cet appareil. 
              </p> 
            </div> 

            <button 
              type="button" 
              onClick={logout} 
              className="btn btn-destructive-outline" 
            > 
              Se déconnecter 
            </button> 
          </div> 

          {/* Suppression du compte */} 
          <div className="flex items-center justify-between gap-4 py-4 last:pb-0"> 
            <div> 
              <p className="text-base font-semibold">Supprimer mon compte</p> 

              <p className="mt-1 text-sm text-muted-foreground"> 
                Supprimer définitivement votre compte et vos données. 
              </p> 
            </div> 

            <button type="button" className="btn btn-destructive-outline"> 
              Supprimer 
            </button> 
          </div> 
        </div> 
      </section> 
    </> 
  ); 
} 
