'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveBusiness(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const name = formData.get("name") as string;
    const id = formData.get("id") as string;

    let error;

    if (id) {
        // Update existing
        const result = await supabase
            .from("businesses")
            .update({ name })
            .eq("id", id)
            .eq("user_id", user.id); // Security check
        error = result.error;
    } else {
        // Create new (Upsert logic from user request, but refined for safety)
        // Check if one already exists to prevent duplicates if user_id isn't unique
        const { data: existing } = await supabase
            .from("businesses")
            .select("id")
            .eq("user_id", user.id)
            .single();

        if (existing) {
            const result = await supabase
                .from("businesses")
                .update({ name })
                .eq("id", existing.id);
            error = result.error;
        } else {
            const result = await supabase
                .from("businesses")
                .insert({
                    user_id: user.id,
                    name,
                });
            error = result.error;
        }
    }

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard/business");
}
