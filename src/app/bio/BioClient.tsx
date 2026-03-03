"use client";

import { motion } from "framer-motion";
import { LanyardPresence } from "@/components/LanyardPresence";
import { WeatherWidget } from "@/components/WeatherWidget";
import { MusicPlayer } from "@/components/MusicPlayer";
import { SubscribeWidget } from "@/components/SubscribeWidget";
import {
    Github, Twitter, Globe, ExternalLink, Settings,
    Mail, Linkedin, Music, Youtube, Instagram, ArrowUpRight, Share2, MessageSquare, Disc
} from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, any> = {
    Github: <Github className="w-5 h-5 stroke-[1.5]" />,
    Twitter: <Twitter className="w-5 h-5 stroke-[1.5]" />,
    Instagram: <Instagram className="w-5 h-5 stroke-[1.5]" />,
    Globe: <Globe className="w-5 h-5 stroke-[1.5]" />,
    Mail: <Mail className="w-5 h-5 stroke-[1.5]" />,
    Linkedin: <Linkedin className="w-5 h-5 stroke-[1.5]" />,
    Music: <Music className="w-5 h-5 stroke-[1.5]" />,
    Youtube: <Youtube className="w-5 h-5 stroke-[1.5]" />,
};

export function BioClient({ profile, links, gallery = [] }: { profile: any, links: any[], gallery?: any[] }) {
    const LAT = profile?.location_lat || 28.6139;
    const LON = profile?.location_lon || 77.2090;
    const LOCATION_NAME = profile?.location_name || "Delhi, India";
    const DISCORD_USER_ID = profile?.discord_id || "1269352892146384957";

    return (
        <main className="min-h-screen bg-[#000000] text-white selection:bg-white/20 px-4 py-12 md:py-24 font-inter bg-mesh">
            <div className="max-w-xl mx-auto space-y-16">

                {/* Profile Card - Editorial Style */}
                <section className="relative text-center space-y-8 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative flex flex-col items-center"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition duration-700" />
                            <img
                                src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=ebnn"}
                                alt="Profile"
                                className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-white/10 grayscale hover:grayscale-0 transition-all duration-700 object-cover shadow-2xl"
                            />
                        </div>

                        {/* Weather - Positioned Below PFP to avoid mixing/overlap */}
                        <div className="mt-4">
                            <WeatherWidget lat={LAT} lon={LON} locationName={LOCATION_NAME} />
                        </div>

                        <div className="mt-8 space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter text-gradient-bw">
                                {profile?.handle || "EBNN"}
                            </h1>
                            <p className="text-white/40 text-sm md:text-base font-medium max-w-[280px] mx-auto tracking-wide italic">
                                {profile?.bio || "Building Scalable & Beautiful digital solutions."}
                            </p>
                        </div>
                    </motion.div>

                    {/* Social Presence Hub */}
                    <div className="w-full max-w-xs">
                        <LanyardPresence userId={DISCORD_USER_ID} />
                    </div>
                </section>

                {/* CURRENT FREQ Section */}
                {profile?.music_enabled && profile?.music_url && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <h2 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Current Freq</h2>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>
                        <MusicPlayer
                            url={profile.music_url}
                            title={profile.music_title}
                            artist={profile.music_artist}
                            coverUrl={profile.music_cover_url}
                        />
                    </section>
                )}

                {/* Gallery Section - Larger 3-Column Grid */}
                {gallery.length > 0 && (
                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <h2 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Media Archive</h2>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                            {gallery.map((media, i) => (
                                <motion.div
                                    key={media.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="relative rounded-xl md:rounded-[2rem] overflow-hidden glass border border-white/5 group aspect-square"
                                >
                                    {media.type === 'video' ? (
                                        <video
                                            src={media.url}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                                        />
                                    ) : (
                                        <img
                                            src={media.url}
                                            alt="Gallery"
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Links Grid - High-end Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {links.map((link, i) => (
                        <motion.a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative flex flex-col justify-between p-5 md:p-6 h-32 md:h-36 glass rounded-[2rem] md:rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white group-hover:text-black transition-all duration-500 overflow-hidden w-9 h-9 md:w-10 md:h-10 flex items-center justify-center">
                                    {link.custom_icon_url ? (
                                        <img src={link.custom_icon_url} className="w-5 h-5 object-contain" />
                                    ) : (
                                        ICON_MAP[link.icon || link.name] || <ExternalLink className="w-4 h-4 stroke-[1.5]" />
                                    )}
                                </div>
                                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                            </div>

                            <div className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                                <h3 className="font-outfit font-black text-base md:text-lg uppercase tracking-tighter opacity-100">{link.name}</h3>
                                <p className="text-[8px] md:text-[9px] text-white/30 truncate mt-0.5 group-hover:text-white/60 tracking-widest leading-none">{link.url.replace("https://", "")}</p>
                            </div>

                            {/* Backglow on Hover */}
                            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 blur-[60px] opacity-0 group-hover:opacity-100 transition duration-500" />
                        </motion.a>
                    ))}
                </div>

                {/* Subscription Protocol */}
                <SubscribeWidget />

                <div className="flex items-center justify-between pt-12 text-white/20 px-2">
                    <div className="flex gap-4">
                        <Link href="/guestbook" className="p-3 hover:text-white transition-colors glass rounded-full" title="Guestbook">
                            <MessageSquare className="w-4 h-4" />
                        </Link>
                        <Link href="/contact" className="p-3 hover:text-white transition-colors glass rounded-full" title="Contact">
                            <Mail className="w-4 h-4" />
                        </Link>
                        <Link href="/bio/admin" className="p-3 hover:text-white transition-colors glass rounded-full" title="Admin">
                            <Settings className="w-4 h-4" />
                        </Link>
                    </div>
                    <p className="text-[10px] uppercase font-black tracking-widest font-outfit">© {new Date().getFullYear()} EBNN CORE HQ</p>
                </div>

            </div>
        </main>
    );
}
