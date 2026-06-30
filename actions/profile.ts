"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase-server";
import type { Profile, Tone } from "@/types";

const VALID_TONES: readonly Tone[] = ["Professional", "Friendly", "Direct"];

export async function saveProfile(
  data: Profile
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.services.trim()) {
      return { success: false, error: "Services description is required." };
    }
    if (!VALID_TONES.includes(data.tone)) {
      return { success: false, error: "Invalid tone selected." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "You must be signed in to save your profile." };
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        services: data.services.trim(),
        tone: data.tone,
        target_client: data.target_client.trim(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (error) throw error;

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("[actions/profile]", error);
    return { success: false, error: "Failed to save profile. Please try again." };
  }
}
