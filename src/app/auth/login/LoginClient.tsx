"use client";

import { motion } from "framer-motion";
import { Shield, Lock, AlertTriangle, ArrowLeft, Disc } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function LoginClient() {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleLogin = async () => {
        setLoading(true);
        await supabase.auth.signInWithOAuth({
            provider: "discord",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                scopes: "identify guilds.members.read",
            },
        });
    };

    const getErrorMessage = (code: string | null) => {
        switch (code) {
            case 'restricted_access':
                return "ACCESS_DENIED: MISSING_DISCORD_ROLE";
            case 'auth_failed':
                return "SIGNAL_LOST: AUTHENTICATION_FAILURE";
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-black text-white font-inter selection:bg-white/20 relative overflow-hidden flex flex-col items-center justify-center p-6 bg-mesh">
            
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-8 left-8"
            >
                <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group">
                    <div className="p-2 glass rounded-xl group-hover:bg-white/5 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest">Protocol / Abort</span>
                </Link>
            </motion.div>

            <div className="max-w-md w-full space-y-12 text-center">
                
                {/* Security Anchor */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative inline-block"
                >
                    <div className="absolute -inset-10 bg-white/5 blur-3xl rounded-full" />
                    <div className="relative w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center border-white/5 shadow-2xl">
                        <Lock className="w-8 h-8 text-white/20" />
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-2 border-t border-r border-white/10 rounded-[3rem]"
                        />
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter text-gradient-bw">
                        Terminal Access
                    </h1>
                    <p className="text-white/40 text-sm font-medium max-w-xs mx-auto tracking-wide italic leading-relaxed">
                        Restricted access point. Identification via EBNN_CORE Discord registry required.
                    </p>
                </div>

                {reason && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 glass rounded-3xl border-red-500/20 bg-red-500/5 space-y-2"
                    >
                        <div className="flex items-center justify-center gap-3 text-red-500">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{getErrorMessage(reason)}</span>
                        </div>
                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Ensure you have the required server role before attempting re-sync.</p>
                    </motion.div>
                )}

                <div className="space-y-6">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-4 px-10 py-6 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 group hover:scale-[1.02]"
                    >
                        {loading ? (
                            <Disc className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Disc className="w-5 h-5 fill-white" />
                                Authenticate via Discord
                            </>
                        )}
                    </button>
                    
                    <div className="pt-8 flex items-center justify-center gap-3 text-white/10">
                        <Shield className="w-4 h-4" />
                        <p className="text-[9px] uppercase font-bold tracking-[0.3em]">Zero-Trust Encrypted Tunnel</p>
                    </div>
                </div>
            </div>

        </main>
    );
}
