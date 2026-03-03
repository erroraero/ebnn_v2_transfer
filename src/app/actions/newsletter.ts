"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import { LRUCache } from "lru-cache";

import { createAdminClient } from "@/utils/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

// Basic Rate Limiter in memory (Per Instance)
const rateLimit = new LRUCache<string, number>({
    max: 500,
    ttl: 1000 * 60 * 60 * 24, // 24 hours
});

export async function subscribeToNewsletter(email: string) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "anonymous";
    const supabase = await createAdminClient();
    
    // 1. Rate Limit Check (Security Protocol)
    const attempts = rateLimit.get(ip) || 0;
    if (attempts >= 5) {
        return { success: false, error: "RATE_LIMIT_EXCEEDED" };
    }
    rateLimit.set(ip, attempts + 1);

    // 2. Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitizedEmail = email.toLowerCase().trim();
    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
        return { success: false, error: "INVALID_IDENTITY_FORMAT" };
    }

    if (!process.env.RESEND_API_KEY || !AUDIENCE_ID) {
        return { success: false, error: "SYSTEM_SYNC_OFFLINE" };
    }

    try {
        // 3. Local Database Check (Prevent Duplicates Before API Calls)
        const { data: existing } = await supabase
            .from("subscribers")
            .select("email")
            .eq("email", sanitizedEmail)
            .maybeSingle();

        if (existing) {
            return { success: false, error: "IDENTITY_ALREADY_CONNECTED" };
        }

        // 4. Synchronize contact to Resend Audience
        const { error: contactError } = await resend.contacts.create({
            email: sanitizedEmail,
            unsubscribed: false,
            audienceId: AUDIENCE_ID,
        });

        // 5. Handle Specific Resend Error Codes
        if (contactError) {
            if (contactError.message.toLowerCase().includes("already exists") || (contactError as any).statusCode === 409) {
                // Also add to local DB if Resend says it exists but we didn't know
                await supabase.from("subscribers").upsert({ email: sanitizedEmail });
                return { success: false, error: "IDENTITY_ALREADY_CONNECTED" };
            }
            
            console.error("Resend API Error:", contactError);
            return { success: false, error: "HANDSHAKE_FAILURE" };
        }

        // 6. Record Synchronization in Local Database
        await supabase.from("subscribers").insert({ email: sanitizedEmail });

        // 7. Dispatch Welcome Broadcast
        const { error: emailError } = await resend.emails.send({
            from: "EBNN CORE <mail@notify.ebnn.xyz>",
            to: sanitizedEmail,
            subject: "// SOVEREIGN_ACCESS: SUBSCRIPTION_ESTABLISHED",
            html: `
                <div style="background-color: #000000; color: #ffffff; padding: 60px 40px; font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a; border-radius: 40px;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="font-size: 32px; font-weight: 900; letter-spacing: -2px; text-transform: uppercase;">EBNN_CORE</h1>
                        <p style="color: #444; font-size: 10px; letter-spacing: 4px; font-weight: 900; text-transform: uppercase;">SOVEREIGN NEWSLETTER</p>
                    </div>
                    
                    <div style="border-top: 1px solid #1a1a1a; border-bottom: 1px solid #1a1a1a; padding: 40px 0; margin-bottom: 40px;">
                        <p style="font-size: 16px; line-height: 1.6; color: #888;">Greetings, Sovereign.</p>
                        <p style="font-size: 16px; line-height: 1.6; color: #ffffff;">Your subscription to the EBNN_CORE technical frequency has been successfully synchronized. You are now established within our secure broadcast network.</p>
                        <p style="font-size: 16px; line-height: 1.6; color: #888;">Expect high-fidelity technical deep dives, exclusive architecture logs, and sovereign design updates directly to your terminal.</p>
                    </div>

                    <div style="text-align: center;">
                        <p style="font-size: 10px; color: #222; letter-spacing: 2px;">© ${new Date().getFullYear()} EBNN CORE HQ • ALL PROTOCOLS RESERVED</p>
                    </div>
                </div>
            `
        });

        if (emailError) {
            console.error("Broadcast Error:", emailError);
            return { success: true, warning: "EMAIL_BROADCAST_DELAYED" };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Critical Runtime Error:", err);
        return { success: false, error: "INTERNAL_CORE_EXCEPTION" };
    }
}
