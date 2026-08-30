import { requireSession } from "@/lib/session";
import Diagnostic from "./_components/layout/Diagnostic";

export default async function page() {
  const session = await requireSession();
  return (
    <div className="flex gap-6 py-2 w-full">
      <Diagnostic user={session.user} />
    </div>
  );
}
