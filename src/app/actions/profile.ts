"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { verifyAdmin } from "@/lib/auth-checks";
import { CORE_IDENTITY_ID } from "@/lib/constants";

export async function updateProfile(formData: FormData) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    const user = { id: CORE_IDENTITY_ID };

    const handle = formData.get("handle") as string;
    const bio = formData.get("bio") as string;
    const discord_id = formData.get("discord_id") as string;
    const avatar_url = formData.get("avatar_url") as string || undefined;
    const location_lat = parseFloat(formData.get("location_lat") as string || "0");
    const location_lon = parseFloat(formData.get("location_lon") as string || "0");
    const location_name = formData.get("location_name") as string || "Delhi, India";

    // Music Fields
    const music_title = formData.get("music_title") as string;
    const music_artist = formData.get("music_artist") as string;
    const music_url = formData.get("music_url") as string;
    const music_cover_url = formData.get("music_cover_url") as string;
    const music_enabled = formData.get("music_enabled") === "true";
    const guestbook_enabled = formData.get("guestbook_enabled") === "true";
    const contact_enabled = formData.get("contact_enabled") === "true";

    const { error } = await supabase
        .from("profiles")
        .upsert({
            id: user.id,
            handle,
            bio,
            discord_id,
            avatar_url,
            location_lat,
            location_lon,
            location_name,
            music_title,
            music_artist,
            music_url,
            music_cover_url,
            music_enabled,
            guestbook_enabled,
            contact_enabled,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        console.error("Profile update error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/bio");
    return { success: true };
}

export async function uploadAvatar(file: File) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    const user = { id: CORE_IDENTITY_ID };

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

    if (uploadError) {
        console.error("Avatar upload error:", uploadError);
        return { success: false, error: uploadError.message };
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    // 3. Save to Profile Table
    const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

    if (profileError) {
        return { success: false, error: profileError.message };
    }

    revalidatePath("/bio");
    return { success: true, url: publicUrl };
}
