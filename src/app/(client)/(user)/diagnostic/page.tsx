import { requireSession } from "@/lib/session";
import Diagnostic from "./_components/layout/Diagnostic";

export default async function page() {
  const session = await requireSession();
  return (
    <section className="flex wrapper">
      <div className="flex flex-col md:flex-row gap-4 py-2">
        <Diagnostic user={session.user} />
      </div>
    </section>
  );
}
