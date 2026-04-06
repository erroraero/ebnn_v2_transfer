import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(req: NextRequest) {
    try {
        return await handler.GET(req);
    } catch (error: any) {
        console.error("[BETTER_AUTH_GET_ERROR]", error);
        return NextResponse.json(
            {
                error: "AUTH_PROTOCOL_ERROR",
                message: error?.message || "Unknown error during GET auth handler",
                hint: getErrorHint(error),
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        return await handler.POST(req);
    } catch (error: any) {
        console.error("[BETTER_AUTH_POST_ERROR]", error);
        return NextResponse.json(
            {
                error: "AUTH_PROTOCOL_ERROR",
                message: error?.message || "Unknown error during POST auth handler",
                hint: getErrorHint(error),
            },
            { status: 500 }
        );
    }
}

function getErrorHint(error: any): string {
    const msg = error?.message?.toLowerCase() || "";
    if (msg.includes("connect") || msg.includes("econnrefused") || msg.includes("tcp") || msg.includes("database") || msg.includes("postgres")) {
        return "DATABASE_CONNECTION_FAILED: Unable to establish connection with the database. Check your DATABASE_URL environment variable.";
    }
    if (msg.includes("relation") || msg.includes("does not exist") || msg.includes("table")) {
        return "SCHEMA_MISSING: Required auth tables do not exist. Run SCHEMA.sql in your Supabase SQL Editor.";
    }
    if (msg.includes("client_id") || msg.includes("github") || msg.includes("oauth")) {
        return "OAUTH_CONFIG_ERROR: GitHub OAuth credentials may be invalid. Check GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.";
    }
    if (msg.includes("secret") || msg.includes("better_auth_secret")) {
        return "SECRET_MISSING: BETTER_AUTH_SECRET environment variable is not set or is invalid.";
    }
    return "UNKNOWN_PROTOCOL_ERROR: Check Vercel function logs for full stack trace.";
}
