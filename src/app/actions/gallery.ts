"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { verifyAdmin } from "@/lib/auth-checks";
import { CORE_IDENTITY_ID } from "@/lib/constants";

export async function uploadMedia(file: File) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    const user = { id: CORE_IDENTITY_ID };

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `gallery/${user.id}/${fileName}`;

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

    if (uploadError) {
        console.error("Media upload error:", uploadError);
        return { success: false, error: uploadError.message };
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    // 3. Save to Gallery Table
    const type = file.type.startsWith("video") ? "video" : "image";
    const { error: dbError } = await supabase
        .from("gallery")
        .insert({
            user_id: user.id,
            url: publicUrl,
            type: type
        });

    if (dbError) {
        return { success: false, error: dbError.message };
    }

    revalidatePath("/bio");
    return { success: true };
}

export async function deleteMedia(id: string, url: string) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();

    // 1. Delete from Storage
    const pathParts = url.split("avatars/");
    if (pathParts.length > 1) {
        const filePath = pathParts[1];
        const { error: storageError } = await supabase.storage
            .from("avatars")
            .remove([filePath]);

        if (storageError) {
            console.error("Storage deletion error:", storageError);
        }
    }

    // 2. Delete from DB
    const { error: dbError } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id);

    if (dbError) {
        return { success: false, error: dbError.message };
    }

    revalidatePath("/bio");
    return { success: true };
}
