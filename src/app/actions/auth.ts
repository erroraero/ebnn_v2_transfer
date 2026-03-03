"use client";

import { createClient } from "@/utils/supabase/client";

export async function signInWithDiscord() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            scopes: 'identify guilds.members.read',
        },
    });

    if (error) throw error;
    return data;
}

export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
}
