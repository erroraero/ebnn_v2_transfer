"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { verifyAdmin } from "@/lib/auth-checks";
import { CORE_IDENTITY_ID } from "@/lib/constants";

export async function addLink(name: string, url: string, icon?: string, custom_icon_url?: string) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    const user = { id: CORE_IDENTITY_ID };

    const { error } = await supabase
        .from("links")
        .insert({
            user_id: user.id,
            name,
            url,
            icon,
            custom_icon_url
        });

    if (error) {
        console.error("Add link error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/bio");
    return { success: true };
}

export async function removeLink(id: string) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    const user = { id: CORE_IDENTITY_ID };

    const { error } = await supabase
        .from("links")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Remove link error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/bio");
    return { success: true };
}

export async function updateLink(id: string, name: string, url: string, icon?: string, custom_icon_url?: string) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    const user = { id: CORE_IDENTITY_ID };

    const { error } = await supabase
        .from("links")
        .update({ name, url, icon, custom_icon_url })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Update link error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/bio");
    return { success: true };
}
