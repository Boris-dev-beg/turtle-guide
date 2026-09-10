import { requireSession } from "@/lib/session";
import Diagnostic from "./_components/layout/Diagnostic";

export default async function page() {
  const session = await requireSession();
  return (
    <section className="flex wrapper py-10">
      <Diagnostic user={session.user} />
    </section>
  );
}
