
export async function checkDiscordRole(userId: string) {
    const devId = (process.env.DEVELOPER_DISCORD_ID || process.env.DISCORD_ID)?.trim();

    console.log('--- [DISCORD_AUTH_SOVEREIGN] ---');
    console.log(`Master Key: ${devId}`);
    console.log(`User Signal: ${userId}`);

    if (!devId) {
        console.error('[DISCORD_AUTH] ❌ CRITICAL: Missing DEVELOPER_DISCORD_ID in environment.');
        return false;
    }

    // Direct ID Verification (Sovereign Pattern)
    const isAuthorized = userId.toString() === devId.toString();

    if (isAuthorized) {
        console.log(`[DISCORD_AUTH] ✅ SOVEREIGN IDENTITY VERIFIED for ${userId}`);
        return true;
    }

    console.log(`[DISCORD_AUTH] ❌ ACCESS DENIED: ID ${userId} does not match Master Key.`);
    return false;
}
