import { requireSession } from "@/lib/session";

export default function layout({ children }: { children: React.ReactNode }) {
  requireSession();
  return <div className="wrapper w-full">{children}</div>;
}
