"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { LRUCache } from "lru-cache";
import { verifyAdmin } from "@/lib/auth-checks";

// Guestbook Rate Limiter
const guestbookLimit = new LRUCache<string, number>({
    max: 500,
    ttl: 1000 * 60 * 60, // 1 hour per IP
});

export async function addGuestbookNote(name: string, note: string) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "anonymous";
    const supabase = await createAdminClient();

    // 0. Check if guestbook is enabled in profile
    const { data: profile } = await supabase.from("profiles").select("guestbook_enabled").single();
    if (profile && !profile.guestbook_enabled) {
        return { success: false, error: "GUESTBOOK_SYNC_OFFLINE" };
    }

    // 1. Security Check
    const attempts = guestbookLimit.get(ip) || 0;
    if (attempts >= 10) {
        return { success: false, error: "RATE_LIMIT_EXCEEDED" };
    }
    guestbookLimit.set(ip, attempts + 1);

    // 2. Validation
    if (!name.trim() || name.length > 50) {
        return { success: false, error: "NAME_REQUIREMENTS_NOT_MET" };
    }
    if (!note.trim() || note.length > 500) {
        return { success: false, error: "NOTE_REQUIREMENTS_NOT_MET" };
    }

    try {
        const { error } = await supabase
            .from("guestbook")
            .insert({ name: name.trim(), note: note.trim() });

        if (error) {
            console.error("Guestbook DB Error:", error);
            return { success: false, error: "TRANSMISSION_FAILURE" };
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: "CORE_RUNTIME_ERROR" };
    }
}

export async function getGuestbookNotes() {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        console.error("Guestbook Fetch Error:", error);
        return [];
    }
    return data || [];
}

export async function deleteGuestbookNotes(ids: string[]) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    const { error } = await supabase
        .from("guestbook")
        .delete()
        .in("id", ids);

    if (error) {
        console.error("Delete Notes Error:", error);
        return { success: false };
    }
    return { success: true };
}

export async function deleteAllGuestbookNotes() {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    const { error } = await supabase
        .from("guestbook")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Standard way to delete all

    if (error) {
        console.error("Delete All Notes Error:", error);
        return { success: false };
    }
    return { success: true };
}
