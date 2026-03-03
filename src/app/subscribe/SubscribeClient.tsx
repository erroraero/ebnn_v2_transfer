"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, Loader2, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Disc, Instagram, Github } from "lucide-react";
import Link from "next/link";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export default function SubscribeClient() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        try {
            const res = await subscribeToNewsletter(email);
            if (res.success) {
                setStatus('success');
                setEmail("");
            } else {
                setStatus('error');
                setErrorMessage(res.error || "UNKNOWN_ERROR");
            }
        } catch (err: any) {
            setStatus('error');
            setErrorMessage("SYSTEM_FAILURE");
        }
        setLoading(false);
    };

    return (
        <>
        <main className="min-h-screen bg-black text-white font-inter selection:bg-white/20 relative overflow-hidden flex flex-col items-center justify-center p-6 bg-mesh">

            {/* Top Navigation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-8 left-8"
            >
                <Link href="/bio" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group">
                    <div className="p-2 glass rounded-xl group-hover:bg-white/5 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest">Abort / Bio</span>
                </Link>
            </motion.div>

            <div className="max-w-md w-full space-y-12 text-center">

                {/* Visual Anchor */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative inline-block"
                >
                    <div className="absolute -inset-10 bg-white/5 blur-3xl rounded-full" />
                    <div className="relative w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center border-white/5 shadow-2xl">
                        <Mail className="w-8 h-8 text-white/20" />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-2 border-t border-r border-white/10 rounded-[3rem]"
                        />
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter text-gradient-bw">
                        Secure Frequency
                    </h1>
                    <p className="text-white/40 text-sm md:text-base font-medium max-w-xs mx-auto tracking-wide italic leading-relaxed">
                        Synchronize your terminal with the EBNN_CORE technical broadcast. Zero noise, absolute technical sovereignty.
                    </p>
                </div>

                {/* Form Logic */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                        <input
                            required
                            type="email"
                            placeholder="SOVEREIGN@NODE.TERMINAL"
                            className="w-full bg-white/5 px-14 py-5 rounded-[2rem] border border-white/5 outline-none focus:border-white/20 transition-all font-outfit font-bold uppercase placeholder:text-white/10 text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-xl shadow-white/5 disabled:opacity-50 group"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                Establish Link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Status Feedback */}
                <AnimatePresence mode="wait">
                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-3 p-4 glass rounded-2xl border-white/10"
                        >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Link Secured: Broadcast Incoming.</p>
                        </motion.div>
                    )}
                    {status === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-3 p-4 glass rounded-2xl border-red-500/20"
                        >
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Error: {errorMessage}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Security Note */}
                <div className="pt-8 flex items-center justify-center gap-3 text-white/10">
                    <ShieldCheck className="w-4 h-4" />
                    <p className="text-[9px] uppercase font-bold tracking-[0.3em]">Encrypted Handshake Protocol v1.4.2</p>
                </div>

            </div>

        </main>
        
        {/* Footer Social Protocol */}
        <div className="pb-12 flex flex-col items-center gap-12 w-full mt-[-100px] relative z-20">
            <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="flex items-center gap-12 text-white/10">
                <Link href="https://www.instagram.com/eb_nnn_" target="_blank" className="flex flex-col items-center gap-3 hover:text-white transition-colors group">
                    <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[7px] font-black tracking-[0.4em] uppercase">Instagram</span>
                </Link>
                <Link href="https://discord.com/users/1375329068450447451" target="_blank" className="flex flex-col items-center gap-3 hover:text-white transition-colors group">
                    <Disc className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[7px] font-black tracking-[0.4em] uppercase">Discord</span>
                </Link>
                <Link href="https://github.com/Ebnxyz" target="_blank" className="flex flex-col items-center gap-3 hover:text-white transition-colors group">
                    <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[7px] font-black tracking-[0.4em] uppercase">Github</span>
                </Link>
                <Link href="mailto:hello@ebnn.xyz" className="flex flex-col items-center gap-3 hover:text-white transition-colors group">
                    <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[7px] font-black tracking-[0.4em] uppercase">Mail</span>
                </Link>
            </div>
        </div>
    </>
    );
}
