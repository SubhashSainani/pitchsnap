"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase-server";

export async function deletePitch(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "You must be signed in to delete a pitch." };
    }

    const { error } = await supabase
      .from("pitches")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;

    revalidatePath("/history");
    return { success: true };
  } catch (error) {
    console.error("[actions/pitches]", error);
    return { success: false, error: "Failed to delete pitch. Please try again." };
  }
}
