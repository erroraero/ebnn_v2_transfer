"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, User, Send, Loader2, ArrowLeft, Clock, Shield, Instagram, Github, Disc, Mail } from "lucide-react";
import Link from "next/link";
import { addGuestbookNote, getGuestbookNotes } from "@/app/actions/guestbook";

interface Note {
    id: string;
    name: string;
    note: string;
    created_at: string;
}

export default function GuestbookClient({ initialNotes, isEnabled }: { initialNotes: Note[], isEnabled: boolean }) {
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEnabled || !name.trim() || !message.trim()) return;
        
        setLoading(true);
        try {
            const res = await addGuestbookNote(name, message);
            if (res.success) {
                setStatus('success');
                setName("");
                setMessage("");
                // Refresh list
                const updated = await getGuestbookNotes();
                setNotes(updated);
            } else {
                setStatus('error');
                setErrorMessage(res.error || "UNKNOWN_ERROR");
            }
        } catch (err) {
            setStatus('error');
            setErrorMessage("SYSTEM_FAILURE");
        }
        setLoading(false);
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <main className="min-h-screen bg-black text-white font-inter selection:bg-white/20 relative overflow-hidden flex flex-col items-center bg-mesh p-6 pb-24">
            
            {/* Header Navigation */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl flex justify-between items-center mb-12 mt-4 md:mt-8"
            >
                <Link href="/bio" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group">
                    <div className="p-2 glass rounded-xl group-hover:bg-white/5 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest">System / Back</span>
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">
                    <Shield className="w-3 h-3" /> Digital Archive v1.0
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
                            <MessageSquare className="w-8 h-8 text-white/20" />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter text-gradient-bw">
                        Guestbook
                    </h1>
                    <p className="text-white/40 text-xs md:text-sm font-medium tracking-widest uppercase italic leading-relaxed">
                        Leave a trace in the sovereign network frequency.
                    </p>
                </div>

                {/* Entry Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[2.5rem] p-6 md:p-10 border border-white/5 relative overflow-hidden"
                >
                    {!isEnabled ? (
                        <div className="py-8 text-center space-y-4">
                            <div className="inline-flex p-4 glass rounded-2xl border-white/5 text-white/20">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black font-outfit uppercase tracking-tighter">Frequency Offline</h3>
                                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">The archivist has sealed this frequency. Traces cannot be left at this time.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-1 space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Identify</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                        <input 
                                            required
                                            placeholder="ALIAS"
                                            className="w-full bg-white/5 px-10 py-4 rounded-2xl border border-white/5 outline-none focus:border-white/20 transition-all font-outfit font-bold uppercase placeholder:text-white/10 text-[11px]"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Transmission</label>
                                    <div className="relative group flex gap-3">
                                        <div className="relative flex-1">
                                            <MessageSquare className="absolute left-4 top-5 w-3.5 h-3.5 text-white/20" />
                                            <input 
                                                required
                                                placeholder="LEAVE A PROTOCOL NOTE..."
                                                className="w-full bg-white/5 px-10 py-4 rounded-2xl border border-white/5 outline-none focus:border-white/20 transition-all font-outfit font-bold uppercase placeholder:text-white/10 text-[11px]"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                        </div>
                                        <button 
                                            disabled={loading || !name || !message}
                                            className="px-6 bg-white text-black rounded-2xl font-black uppercase text-[10px] hover:scale-105 transition-all shadow-xl shadow-white/5 disabled:opacity-20 flex items-center justify-center translate-y-0"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <AnimatePresence>
                            {status === 'success' && (
                                <motion.p 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-6 text-[9px] font-black uppercase tracking-widest text-white/60 text-center"
                                >
                                    Note Synchronized Successfully.
                                </motion.p>
                            )}
                            {status === 'error' && (
                                <motion.p 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-6 text-[9px] font-black uppercase tracking-widest text-red-500 text-center"
                                >
                                    Transmission Failed: {errorMessage || "SYSTEM_ERROR"}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        </>
                    )}
                </motion.div>

                {/* Archive Feed */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 py-4">
                        <div className="h-px flex-1 bg-white/10" />
                        <h2 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Archive Feed</h2>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {notes.map((note, i) => (
                            <motion.div 
                                key={note.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.02 }}
                                className="glass rounded-3xl p-6 border border-white/5 group hover:border-white/10 transition-all"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 glass rounded-xl flex items-center justify-center border-white/10">
                                            <User className="w-3 h-3 text-white/20" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-widest text-white/80">{note.name}</h3>
                                            <div className="flex items-center gap-1.5 text-[8px] font-bold text-white/20 tracking-widest uppercase">
                                                <Clock className="w-2.5 h-2.5" />
                                                {new Date(note.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[8px] font-black tracking-[0.3em] text-white/5 uppercase">Trace #{note.id.split('-')[0]}</div>
                                </div>
                                <p className="text-[11px] md:text-xs text-white/50 leading-relaxed font-medium pl-11">
                                    {note.note}
                                </p>
                            </motion.div>
                        ))}
                    </div>
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
