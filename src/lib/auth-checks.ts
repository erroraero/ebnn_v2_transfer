import { createClient } from '@/utils/supabase/server';
import { checkDiscordRole } from '@/lib/discord';
import { redirect } from 'next/navigation';

export async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.warn(`[AUTH_CHECK] Unauthorized access: ${userError?.message || 'No user session'}`);
        return { authorized: false, user: null, error: 'Unauthorized' };
    }

    // Tier 1: JWT Session check
    if (user.app_metadata?.role === 'admin') {
        return { authorized: true, user, error: null };
    }

    // Tier 2: Refresh identity from Database (Handles stale sessions)
    try {
        const { createAdminClient } = await import('@/utils/supabase/server');
        const adminClient = await createAdminClient();
        const { data: { user: dbUser }, error: dbError } = await adminClient.auth.admin.getUserById(user.id);

        if (!dbError && dbUser?.app_metadata?.role === 'admin') {
            console.log(`[AUTH_CHECK] Verified ${user.email} status via DB record.`);
            return { authorized: true, user: dbUser, error: null };
        }
    } catch (e) {
        console.error('[AUTH_CHECK] DB Verification failed:', e);
    }

    // Tier 3: Live Discord Signal (Final Fallback)
    const isDiscord = user.app_metadata?.provider === 'discord';
    if (isDiscord) {
        const discordId = user.user_metadata.provider_id || user.user_metadata.sub || user.id;
        const hasAccess = await checkDiscordRole(discordId);
        
        if (hasAccess) {
            console.log(`[AUTH_CHECK] Emergency fallback: Live Discord verification successful for ${user.email}`);
            return { authorized: true, user, error: null };
        }
    }

    console.warn(`[AUTH_CHECK] Restricted Access Attempt: ${user.email}`);
    return { authorized: false, user, error: 'Restricted' };
}

export async function protectAdminPage() {
    const { authorized, error } = await verifyAdmin();

    if (!authorized) {
        if (error === 'Restricted') {
            redirect('/auth/login?reason=restricted_access');
        } else {
            redirect('/auth/login');
        }
    }

    return { authorized };
}
