'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFAQ(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    // Get the user's business_id
    const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!business) throw new Error("No business found");

    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;

    const { error } = await supabase.from("faqs").insert({
        business_id: business.id,
        question,
        answer,
    });

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/faqs");
}

export async function deleteFAQ(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const id = formData.get("id") as string;

    const { error } = await supabase.from("faqs").delete().eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/faqs");
}
