"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MusicPlayer({ url, title, artist, coverUrl }: { url: string, title?: string, artist?: string, coverUrl?: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setProgress((current / total) * 100);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const time = (parseFloat(e.target.value) / 100) * duration;
            audioRef.current.currentTime = time;
            setProgress(parseFloat(e.target.value));
        }
    };

    return (
        <div className="w-full glass rounded-3xl md:rounded-[2.5rem] border border-white/5 p-4 md:p-8 relative overflow-hidden group/player shadow-2xl">
            {/* Background Glow */}
            <div className="absolute -inset-20 bg-white/5 blur-[100px] opacity-0 group-hover/player:opacity-100 transition duration-1000 rounded-full" />

            <div className="relative flex flex-col sm:flex-row items-center gap-4 md:gap-8">
                {/* Cover Art */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 shrink-0">
                    <div className={`absolute inset-0 bg-white/10 blur-2xl rounded-full transition-transform duration-[2000ms] ${isPlaying ? 'scale-125' : 'scale-100'}`} />
                    <div className={`w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 relative z-10 shadow-2xl transition-all duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}>
                        {coverUrl ? (
                            <img src={coverUrl} className={`w-full h-full object-cover grayscale transition-all duration-700 ${isPlaying ? 'grayscale-0 rotate-3' : 'grayscale'}`} />
                        ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                <Music className="w-8 h-8 md:w-10 md:h-10 text-white/20" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls & Metadata */}
                <div className="flex-1 w-full space-y-6">
                    <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
                        <h3 className="text-lg md:text-2xl font-black font-outfit uppercase tracking-tighter text-white truncate">
                            {title || "Silent Protocol"}
                        </h3>
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/30 italic truncate">
                            {artist || "EBNN_CORE"}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Progress Bar */}
                        <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-white transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={handleSeek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center justify-center md:justify-start gap-4 sm:gap-8">
                            <button className="text-white/20 hover:text-white transition-colors">
                                <SkipBack className="w-5 h-5 fill-current" />
                            </button>
                            <button
                                onClick={togglePlay}
                                className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl shadow-white/10"
                            >
                                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                            </button>
                            <button className="text-white/20 hover:text-white transition-colors">
                                <SkipForward className="w-5 h-5 fill-current" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
}
