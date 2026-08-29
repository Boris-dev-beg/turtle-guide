import { requireSession } from "@/lib/session";
import Diagnostic from "./_components/layout/Diagnostic";

export default async function page() {
  const session = await requireSession();
  return (
    <div>
      <Diagnostic user={session.user} />
    </div>
  );
}
