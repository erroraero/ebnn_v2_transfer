"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { LRUCache } from "lru-cache";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth-checks";

// Contact Rate Limiter
const contactLimit = new LRUCache<string, number>({
    max: 500,
    ttl: 1000 * 60 * 60 * 24, // 24 hours per IP
});

export async function submitContactForm(formData: FormData) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "anonymous";
    const supabase = await createAdminClient();

    // 0. Check Status
    const { data: profile } = await supabase.from("profiles").select("contact_enabled").single();
    if (profile && !profile.contact_enabled) {
        return { success: false, error: "TERMINAL_OFFLINE" };
    }

    // 1. Rate Limit
    const attempts = contactLimit.get(ip) || 0;
    if (attempts >= 5) {
        return { success: false, error: "RATE_LIMIT_EXCEEDED" };
    }
    contactLimit.set(ip, attempts + 1);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const file = formData.get("attachment") as File | null;

    if (!name || !email || !message) {
        return { success: false, error: "MISSING_IDENTITY_DATA" };
    }

    let attachment_url = null;

    // 2. Handle Attachment
    if (file && file.size > 0) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return { success: false, error: "PAYLOAD_TOO_LARGE" };
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `contacts/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("attachments")
            .upload(filePath, file);

        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
                .from("attachments")
                .getPublicUrl(filePath);
            attachment_url = publicUrl;
        }
    }

    // 3. Insert Record
    try {
        const { error } = await supabase
            .from("contact_submissions")
            .insert({ name, email, message, attachment_url });

        if (error) throw error;

        revalidatePath("/bio/admin");
        return { success: true };
    } catch (err) {
        console.error("Contact Submission Error:", err);
        return { success: false, error: "TRANSMISSION_FAILURE" };
    }
}

export async function getContactSubmissions() {
    const { authorized } = await verifyAdmin();
    if (!authorized) return [];

    const supabase = await createAdminClient();
    const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Fetch Contacts Error:", error);
        return [];
    }
    return data || [];
}

export async function deleteContactSubmission(id: string) {
    const { authorized } = await verifyAdmin();
    if (!authorized) return { success: false, error: "Access Denied" };

    const supabase = await createAdminClient();
    
    // 1. Get attachment path if exists to delete from storage
    const { data } = await supabase.from("contact_submissions").select("attachment_url").eq("id", id).single();
    if (data?.attachment_url) {
        const path = data.attachment_url.split("/").pop();
        if (path) {
            await supabase.storage.from("attachments").remove([`contacts/${path}`]);
        }
    }

    const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

    if (error) return { success: false };
    revalidatePath("/bio/admin");
    return { success: true };
}
