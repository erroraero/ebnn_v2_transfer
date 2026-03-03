"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Send, Loader2, ArrowLeft, Shield, Paperclip, CheckCircle2, AlertTriangle, FileText, Instagram, Github, Disc } from "lucide-react";
import Link from "next/link";
import { submitContactForm } from "@/app/actions/contact";

export default function ContactClient({ isEnabled }: { isEnabled: boolean }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");
    const [attachmentName, setAttachmentName] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isEnabled) return;
        
        setLoading(true);
        setStatus('idle');
        
        const formData = new FormData(e.currentTarget);
        try {
            const res = await submitContactForm(formData);
            if (res.success) {
                setStatus('success');
                e.currentTarget.reset();
                setAttachmentName("");
            } else {
                setStatus('error');
                setErrorMessage(res.error || "UNKNOWN_ERROR");
            }
        } catch (err) {
            setStatus('error');
            setErrorMessage("CORE_FAILURE");
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-black text-white font-inter selection:bg-white/20 relative overflow-hidden flex flex-col items-center bg-mesh p-6 pb-24">
            
            {/* Header Navigation */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl flex justify-between items-center mb-12 mt-4 md:mt-8"
            >
                <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group">
                    <div className="p-2 glass rounded-xl group-hover:bg-white/5 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest">Protocol / Return</span>
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">
                    <Shield className="w-3 h-3" /> Secure Link v2.0
                </div>
            </motion.div>

            <div className="max-w-2xl w-full space-y-12">
                
                {/* Visual Identity */}
                <div className="text-center space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative inline-block mb-4"
                    >
                        <div className="absolute -inset-10 bg-white/5 blur-3xl rounded-full" />
                        <div className="relative w-20 h-20 glass rounded-[2.5rem] flex items-center justify-center border-white/5 shadow-2xl">
                            <Mail className="w-8 h-8 text-white/20" />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter text-gradient-bw">
                        Contact Core
                    </h1>
                    <p className="text-white/40 text-xs md:text-sm font-medium tracking-widest uppercase italic leading-relaxed">
                        Establish a direct point-to-point transmission link.
                    </p>
                </div>

                {!isEnabled ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-[3rem] p-20 text-center border-white/5"
                    >
                        <Shield className="w-12 h-12 text-white/10 mx-auto mb-6" />
                        <h3 className="text-2xl font-black font-outfit uppercase tracking-tighter mb-2">Terminal Restricted</h3>
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Communication frequency has been manually restricted by the sovereign.</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-[3rem] p-8 md:p-12 border border-white/5"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-2">Identity Alias</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 transition-colors group-focus-within:text-white" />
                                        <input 
                                            required
                                            name="name"
                                            placeholder="Sovereign Node"
                                            className="w-full bg-white/5 pl-14 pr-6 py-5 rounded-2xl border border-white/5 outline-none focus:border-white/20 transition-all font-outfit font-bold uppercase placeholder:text-white/10 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-2">Return Frequency</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 transition-colors group-focus-within:text-white" />
                                        <input 
                                            required
                                            type="email"
                                            name="email"
                                            placeholder="Frequency@Terminal"
                                            className="w-full bg-white/5 pl-14 pr-6 py-5 rounded-2xl border border-white/5 outline-none focus:border-white/20 transition-all font-outfit font-bold uppercase placeholder:text-white/10 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-2">Transmission Data</label>
                                <textarea 
                                    required
                                    name="message"
                                    rows={5}
                                    placeholder="SYNCHRONIZE MESSAGE PROTOCOL..."
                                    className="w-full bg-white/5 px-8 py-6 rounded-[2rem] border border-white/5 outline-none focus:border-white/20 transition-all font-outfit font-bold uppercase placeholder:text-white/10 text-sm resize-none"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <label className="w-full md:flex-1 cursor-pointer group">
                                    <div className="flex items-center gap-4 px-8 py-5 glass rounded-2xl border-white/5 group-hover:bg-white/5 transition-all">
                                        <Paperclip className="w-4 h-4 text-white/20 group-hover:text-white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate">
                                            {attachmentName || "Attach Document (Optional)"}
                                        </span>
                                    </div>
                                    <input 
                                        type="file" 
                                        name="attachment"
                                        className="hidden" 
                                        onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || "")}
                                    />
                                </label>

                                <button 
                                    disabled={loading}
                                    className="w-full md:w-auto px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all shadow-xl shadow-white/10 disabled:opacity-20 flex items-center justify-center gap-3"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Initiate Link <Send className="w-4 h-4" /></>}
                                </button>
                            </div>
                        </form>

                        <AnimatePresence mode="wait">
                            {status === 'success' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 p-6 glass rounded-2xl border-white/20 flex items-center gap-4 animate-pulse"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Transmission Logged. Link Established.</p>
                                </motion.div>
                            )}
                            {status === 'error' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 p-6 glass rounded-2xl border-red-500/20 flex items-center gap-4"
                                >
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Error: {errorMessage}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Secure Badge */}
                <div className="pt-12 flex flex-col items-center gap-4 text-white/10">
                    <div className="flex items-center gap-6">
                        <FileText className="w-6 h-6" />
                        <Shield className="w-6 h-6" />
                        <Send className="w-6 h-6" />
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-[0.5em]">End-to-End Encryption Enabled</p>
                </div>

                {/* Footer Social Protocol */}
                <div className="pt-24 pb-8 flex flex-col items-center gap-12 w-full">
                    <div className="h-px w-full max-w-lg bg-gradient-to-r from-transparent via-white/5 to-transparent" />
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

            </div>
        </main>
    );
}
