"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export function SubscribeWidget() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await subscribeToNewsletter(email);
            if (res.success) {
                setStatus('success');
                setEmail("");
            } else {
                setStatus('error');
                setErrorMessage(res.error || "UNKNOWN_ERROR");
            }
        } catch (err) {
            setStatus('error');
        }
        setLoading(false);
        // Reset status after a few seconds
        setTimeout(() => setStatus('idle'), 5000);
    };

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <h2 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Frequency Sync</h2>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="glass rounded-[2.5rem] p-6 md:p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute -inset-20 bg-white/5 blur-[100px] opacity-0 group-hover:opacity-100 transition duration-1000 rounded-full" />

                <div className="relative space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-black font-outfit uppercase tracking-tighter text-white">Newsletter Protocol</h3>
                        <p className="text-xs text-white/40 font-medium italic">Join the technical broadcast network.</p>
                    </div>

                    <form onSubmit={handleSubscribe} className="relative flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                            <input
                                required
                                type="email"
                                placeholder="EMAIL@NODE.LINK"
                                className="w-full bg-white/5 px-12 py-4 rounded-2xl border border-white/5 outline-none focus:border-white/20 transition-all font-outfit font-bold uppercase text-xs placeholder:text-white/10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            disabled={loading || status === 'success'}
                            className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-white/5 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <>Connect <ArrowRight className="w-3.5 h-3.5" /></>}
                        </button>
                    </form>

                    <AnimatePresence>
                        {status === 'success' && (
                            <motion.p
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[9px] uppercase font-black tracking-widest text-white/60 text-center"
                            >
                                Connection Established. Welcome to the core.
                            </motion.p>
                        )}
                        {status === 'error' && (
                            <motion.p
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[9px] uppercase font-black tracking-widest text-red-500 text-center"
                            >
                                Sync Failed: {errorMessage || "CORE_EXCEPTION"}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
