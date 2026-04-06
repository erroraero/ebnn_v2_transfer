import { NextResponse } from "next/server";

export async function GET() {
    const diagnostics: Record<string, string> = {};

    // Check environment variables
    diagnostics.DATABASE_URL = process.env.DATABASE_URL ? "SET (" + process.env.DATABASE_URL.substring(0, 20) + "...)" : "MISSING";
    diagnostics.BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET ? "SET" : "MISSING";
    diagnostics.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ? "SET (" + process.env.GITHUB_CLIENT_ID.substring(0, 6) + "...)" : "MISSING";
    diagnostics.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ? "SET" : "MISSING";
    diagnostics.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "MISSING";

    // Check database connection
    try {
        const postgres = (await import("postgres")).default;
        const sql = postgres(process.env.DATABASE_URL!, { max: 1, connect_timeout: 5 });
        await sql`SELECT 1`;
        diagnostics.DB_CONNECTION = "OK";

        // Check if auth tables exist
        const tables = await sql`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('user', 'session', 'account', 'verification')
        `;
        diagnostics.AUTH_TABLES = tables.map((t: any) => t.table_name).join(", ") || "NONE FOUND - Run SCHEMA.sql";
        
        await sql.end();
    } catch (error: any) {
        diagnostics.DB_CONNECTION = "FAILED: " + error.message;
    }

    return NextResponse.json({
        status: "EBNN Auth Diagnostics",
        timestamp: new Date().toISOString(),
        diagnostics,
    });
}
