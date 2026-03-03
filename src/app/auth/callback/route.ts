import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/utils/supabase/server';
import { checkDiscordRole } from '@/lib/discord';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/bio/admin';

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error && data.session) {
            const user = data.user;
            
            // Get Discord Snowflake ID from metadata
            const discordId = user.user_metadata.provider_id || user.user_metadata.sub || user.id;
            const providerToken = data.session.provider_token;
            
            // Check if this is an admin login attempt
            const isAdminPath = next.startsWith('/bio/admin');
            const isSourceAdmin = searchParams.get('source') === 'admin';
            const isAdminLogin = isAdminPath || isSourceAdmin;

            console.log(`[AUTH_CALLBACK] Login for ${user.email}. AdminRequest: ${isAdminLogin}`);

            if (isAdminLogin) {
                // Verify Sovereign Identity
                const isAuthorized = await checkDiscordRole(discordId);
                
                if (isAuthorized) {
                    console.log(`[AUTH_CALLBACK] Discord verification successful for ${user.email}. Tagging as admin...`);
                    const adminClient = await createAdminClient();
                    const { error: updateError } = await adminClient.auth.admin.updateUserById(user.id, {
                        app_metadata: { ...user.app_metadata, role: 'admin' }
                    });

                    if (updateError) {
                        console.error(`[AUTH_CALLBACK] ❌ FAILED to tag user ${user.email} as admin:`, updateError);
                    } else {
                        console.log(`[AUTH_CALLBACK] ✅ User ${user.email} is now a VERIFIED ADMIN in the database.`);
                    }
                    
                    return NextResponse.redirect(`${origin}${next}`);
                } else {
                    // Not authorized: Sign out and redirect with reason
                    await supabase.auth.signOut();
                    return NextResponse.redirect(`${origin}/auth/login?reason=restricted_access`);
                }
            }
            
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/auth/login?reason=auth_failed`);
}
