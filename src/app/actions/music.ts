"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { verifyAdmin } from "@/lib/auth-checks";
import { CORE_IDENTITY_ID } from "@/lib/constants";

export async function uploadMusic(file: File) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
    const filePath = `music/${CORE_IDENTITY_ID}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

    if (uploadError) return { success: false, error: uploadError.message };

    const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
}

export async function uploadMusicCover(file: File) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
    const filePath = `music_covers/${CORE_IDENTITY_ID}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

    if (uploadError) return { success: false, error: uploadError.message };

    const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
}

export async function uploadCustomLinkIcon(file: File) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
    const filePath = `custom_icons/${CORE_IDENTITY_ID}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

    if (uploadError) return { success: false, error: uploadError.message };

    const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
}
