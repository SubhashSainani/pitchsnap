import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase-server";
import { isPlan, type Plan } from "@/types";

type Props = {
  children: React.ReactNode;
};

export default async function AppLayout({ children }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let plan: Plan | null = null;
  let cancelAt: string | null = null;
  if (user) {
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("plan, cancel_at")
      .eq("user_id", user.id)
      .maybeSingle();
    plan = isPlan(profileRow?.plan) ? profileRow.plan : "free";
    cancelAt = profileRow?.cancel_at ?? null;
  }

  return (
    <>
      <Navbar plan={plan} cancelAt={cancelAt} />
      {children}
    </>
  );
}
