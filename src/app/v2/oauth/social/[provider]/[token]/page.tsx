"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Loader2, Shield, ArrowRight, AlertCircle, Smartphone, Monitor, ShieldCheck, Globe, RefreshCw } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorHint, setErrorHint] = useState<string | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsExpired(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleLogin = async () => {
        if (isExpired) {
            setError("TOKEN_EXPIRED");
            setErrorHint("Access frequency has timed out. Regenerate the challenge to proceed.");
            return;
        }
        setLoading(true);
        setError(null);
        setErrorHint(null);
        try {
            const result = await signIn.social({
                provider: "github",
                callbackURL: "/guestbook",
                errorCallbackURL: window.location.href,
            });
            if (result?.error) {
                setError(result.error.code || "AUTH_ERROR");
                setErrorHint(result.error.message || "The authentication handshake failed. Check server logs.");
                setLoading(false);
            }
        } catch (err: any) {
            let hint = "Protocol error during authentication handshake.";
            try {
                const res = await fetch("/api/auth/health");
                if (res.ok) {
                    const data = await res.json();
                    const d = data.diagnostics;
                    if (d.DB_CONNECTION?.startsWith("FAILED")) {
                        hint = "DATABASE_OFFLINE: " + d.DB_CONNECTION;
                    } else if (d.AUTH_TABLES === "NONE FOUND - Run SCHEMA.sql") {
                        hint = "SCHEMA_MISSING: Auth tables not found. Admin must run SCHEMA.sql in Supabase.";
                    } else if (d.GITHUB_CLIENT_ID === "MISSING") {
                        hint = "OAUTH_NOT_CONFIGURED: GITHUB_CLIENT_ID environment variable is missing.";
                    } else if (d.BETTER_AUTH_SECRET === "MISSING") {
                        hint = "SECRET_MISSING: BETTER_AUTH_SECRET environment variable is not set.";
                    }
                }
            } catch (_) {}
            setError(err.message || "HANDSHAKE_FAILED");
            setErrorHint(hint);
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white font-inter selection:bg-white/20 relative overflow-hidden flex flex-col items-center justify-center bg-mesh p-4 sm:p-6">
            <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white/5 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white/5 blur-[120px] rounded-full delay-1000 animate-pulse" />
            <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6 sm:mb-8 px-2">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                        <Shield className="w-3 h-3" /> Secure Node / Auth
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-mono tabular-nums ${isExpired ? "text-red-500" : "text-white/40"}`}>
                        {formatTime(timeLeft)}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-[2rem] p-6 sm:p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 sm:p-6 flex gap-3 text-white/5">
                        <Monitor className="w-4 h-4" />
                        <Smartphone className="w-4 h-4" />
                        <Globe className="w-4 h-4" />
                    </div>
                    <div className="space-y-6 sm:space-y-8">
                        <div className="space-y-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 glass rounded-2xl flex items-center justify-center border-white/10 group-hover:border-white/20 transition-all duration-500 shadow-2xl">
                                <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white/20" />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-2xl sm:text-3xl font-black font-outfit uppercase tracking-tighter text-gradient-bw">Identity Entry</h1>
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">Protocol: {params.provider || "Github"} Social Node</p>
                            </div>
                        </div>
                        <AnimatePresence>
                            {(error || errorHint || isExpired) && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="px-4 py-3 glass rounded-xl border border-red-500/10 bg-red-500/5 space-y-2 mb-2">
                                        <div className="flex gap-3">
                                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-[9px] text-red-500 font-black uppercase tracking-widest leading-relaxed">
                                                {isExpired ? "TOKEN_EXPIRED" : error || "PROTOCOL_ERROR"}
                                            </p>
                                        </div>
                                        {(errorHint || isExpired) && (
                                            <p className="text-[8px] text-red-500/60 font-mono leading-relaxed pl-7">
                                                {isExpired ? "The identity challenge has timed out for security. Regenerate to proceed." : errorHint}
                                            </p>
                                        )}
                                    </div>
                                    <button onClick={() => window.location.reload()} className="w-full py-2 text-[8px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center justify-center gap-2">
                                        <RefreshCw className="w-3 h-3" /> [ Regenerate Challenge Request ]
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="space-y-4">
                            <button onClick={handleLogin} disabled={loading || isExpired} className="w-full h-14 sm:h-16 bg-white text-black rounded-2xl flex items-center justify-center gap-3 sm:gap-4 group/btn relative overflow-hidden transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                {loading ? (
                                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                ) : (
                                    <>
                                        <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Connect GitHub Node</span>
                                        <ArrowRight className="w-4 h-4 translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-center px-2 sm:px-4">
                                By proceeding, you verify your identity on the sovereign archival network.
                            </p>
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-3 gap-3 sm:gap-4">
                    {[
                        { label: "Protocol", value: "AES-256" },
                        { label: "Session", value: "60:00" },
                        { label: "Node", value: "EBNN-OAUTH" },
                    ].map((item) => (
                        <div key={item.label} className="glass rounded-xl p-2 sm:p-3 border-white/5 text-center">
                            <p className="text-[7px] font-black text-white/10 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-[8px] sm:text-[9px] font-black text-white/40 uppercase tabular-nums">{item.value}</p>
                        </div>
                    ))}
                </motion.div>
                <div className="text-center pt-6 sm:pt-8">
                    <Link href="/guestbook" className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                        [ Return to Protocol ]
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
