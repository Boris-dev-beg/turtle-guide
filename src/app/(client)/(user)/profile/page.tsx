import { requireSession } from "@/lib/session";
import Profile from "./_components/profile";

export default async function page() {
  const session = await requireSession();
  const user = session?.user;
  
  return (
    <div className="px-4 py-10 w-full flex flex-col">
      {/* Header */}
      <div className="mb-10">
        <p className="font-semibold text-primary text-lg">Mon espace</p>

        <h1 className="text-3xl font-black tracking-tight">Votre profil</h1>

        <p className="mt-2 text-muted-foreground">
          Gérez simplement les informations de votre compte.
        </p>
      </div>

      <Profile user={user} />
    </div>
  );
}
