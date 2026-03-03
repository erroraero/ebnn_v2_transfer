"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
    ArrowRight, MessageSquare, Mail, Shield, 
    ChevronRight, Zap, Globe, Cpu, Command,
    Instagram, Github, Disc
} from "lucide-react";
import { useRef } from "react";

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <main ref={containerRef} className="min-h-screen bg-black text-white selection:bg-white/20 font-inter relative overflow-hidden bg-mesh">
            
            {/* Dynamic Background Elements */}
            <motion.div 
                style={{ y: backgroundY }}
                className="absolute inset-0 pointer-events-none z-0"
            >
                <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-white/5 blur-[120px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[20%] right-[5%] w-[35vw] h-[35vw] bg-white/5 blur-[150px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
            </motion.div>

            {/* Top Navigation */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-center"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 glass rounded-xl flex items-center justify-center border-white/10 group cursor-pointer overflow-hidden">
                        <div className="relative">
                            <Zap className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-white blur-lg opacity-0 group-hover:opacity-40 transition-opacity" />
                        </div>
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.4em] hidden sm:block">EBNN_CORE</span>
                </div>
                
                <nav className="flex items-center gap-2 p-1.5 glass rounded-full border-white/5 backdrop-blur-2xl">
                    <NavLink href="/bio" label="Identity" />
                    <NavLink href="/guestbook" label="Archive" />
                    <NavLink href="/subscribe" label="Synchronize" />
                    <NavLink href="/contact" label="Contact" />
                </nav>
            </motion.header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center pt-32">
                <motion.div
                    style={{ opacity: textOpacity }}
                    className="max-w-5xl space-y-12"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-2 glass rounded-full border-white/5 text-[9px] font-black uppercase tracking-[0.4em] text-white/40"
                    >
                        <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                        Network Live: Frequency Optimized
                    </motion.div>

                    <div className="space-y-6">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-[13vw] md:text-[8vw] font-black font-outfit uppercase tracking-tighter leading-[0.8] text-gradient-bw"
                        >
                            Sovereign <br />
                            Intelligence.
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/40 text-xs md:text-sm font-medium max-w-xl mx-auto tracking-widest uppercase italic leading-loose"
                        >
                            Architecting the next paradigm of high-fidelity digital presence. 
                            Zero noise. Absolute technical sovereignty.
                        </motion.p>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
                    >
                        <Link href="/bio" className="group w-full sm:w-auto px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-2xl shadow-white/20 flex items-center justify-center gap-3">
                            Initiate Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/bio/admin" className="w-full sm:w-auto px-12 py-6 glass border border-white/10 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all text-white/40 hover:text-white flex items-center justify-center gap-2">
                             Command Center
                        </Link>
                    </motion.div>
                </motion.div>
                
                {/* Scroll Indicator */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                >
                    <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
                    <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/10 [writing-mode:vertical-lr]">Scroll</span>
                </motion.div>
            </section>

            {/* Modules Grid */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 py-32 space-y-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FeaturedModule 
                        href="/bio"
                        title="Identity Hub"
                        category="CORE_PROTOCOL"
                        description="Sovereign profile synchronization with real-time location and media broadcasts."
                        icon={<Cpu className="w-6 h-6" />}
                        delay={0.1}
                    />
                    <FeaturedModule 
                        href="/guestbook"
                        title="Social Archive"
                        category="SIGNAL_TRACE"
                        description="Digital trace repository for public frequency interactions and sovereign archive management."
                        icon={<MessageSquare className="w-6 h-6" />}
                        delay={0.2}
                    />
                    <FeaturedModule 
                        href="/subscribe"
                        title="Broadcast Sync"
                        category="FREQUENCY_LINK"
                        description="Direct high-fidelity technical synchronization with the EBNN network broadcast."
                        icon={<Mail className="w-6 h-6" />}
                        delay={0.3}
                    />
                    <FeaturedModule 
                        href="/bio/admin"
                        title="Systems Console"
                        category="MASTER_OVERRIDE"
                        description="Complete administrative orchestration of frequency states and digital artifacts."
                        icon={<Shield className="w-6 h-6" />}
                        delay={0.4}
                    />
                </div>

                {/* Corporate Signature */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="flex flex-col items-center gap-12 pt-32 pb-12 border-t border-white/5"
                >
                    <div className="flex items-center gap-16 md:gap-32 text-white/10">
                        <Link href="https://www.instagram.com/eb_nnn_" target="_blank" className="flex flex-col items-center gap-4 hover:text-white transition-colors group">
                            <Instagram className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-black tracking-[0.5em] uppercase">Instagram</span>
                        </Link>
                        <Link href="https://discord.com/users/1375329068450447451" target="_blank" className="flex flex-col items-center gap-4 hover:text-white transition-colors group">
                            <Disc className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-black tracking-[0.5em] uppercase">Discord</span>
                        </Link>
                        <Link href="https://github.com/Ebnxyz" target="_blank" className="flex flex-col items-center gap-4 hover:text-white transition-colors group">
                            <Github className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-black tracking-[0.5em] uppercase">Github</span>
                        </Link>
                        <Link href="mailto:hello@ebnn.xyz" className="flex flex-col items-center gap-4 hover:text-white transition-colors group">
                            <Mail className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-black tracking-[0.5em] uppercase">Mail</span>
                        </Link>
                    </div>
                    
                    <div className="text-center space-y-4">
                        <Link href="/contact" className="text-[10px] uppercase font-black tracking-[1em] text-white/20 hover:text-white transition-colors">ESTABLISHED_2026_CONTACT</Link>
                        <h2 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter text-white/5 mt-4">EBNN_ARCHITECTURAL_GROUP</h2>
                        <div className="flex items-center justify-center gap-3 pt-8">
                             <div className="w-2 h-2 rounded-full bg-white/20" />
                             <div className="w-24 h-px bg-white/5" />
                             <div className="w-2 h-2 rounded-full bg-white/20" />
                        </div>
                    </div>
                </motion.div>
            </section>

        </main>
    );
}

function NavLink({ href, label }: { href: string, label: string }) {
    return (
        <Link 
            href={href}
            className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300"
        >
            {label}
        </Link>
    );
}

function FeaturedModule({ href, title, category, description, icon, delay }: { 
    href: string, title: string, category: string, description: string, icon: React.ReactNode, delay: number 
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
        >
            <Link href={href} className="block group">
                <div className="p-10 md:p-14 glass rounded-[4rem] border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-700 relative overflow-hidden h-full flex flex-col justify-between min-h-[420px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-white/10 transition-colors duration-700" />
                    
                    <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                                {icon}
                            </div>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>
                        
                        <div className="space-y-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">{category}</span>
                            <h3 className="text-3xl md:text-4xl font-black font-outfit uppercase tracking-tighter leading-none group-hover:text-gradient-bw transition-all duration-700">{title}</h3>
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs group-hover:text-white/60 transition-colors duration-700">
                            {description}
                        </p>
                        <div className="flex items-center gap-3 text-white/20 group-hover:text-white transition-colors duration-700">
                            <span className="text-[10px] font-black uppercase tracking-widest">Connect_Link</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-700" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
