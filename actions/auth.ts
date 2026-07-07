"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase-server";

export async function signOut(): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("[actions/auth]", error);
    redirect("/generate?error=signout_failed");
  }
  redirect("/");
}
