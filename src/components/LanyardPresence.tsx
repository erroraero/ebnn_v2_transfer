"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function LanyardPresence({ userId }: { userId: string }) {
    const { data, error } = useSWR(userId ? `https://api.lanyard.rest/v1/users/${userId}` : null, fetcher, {
        refreshInterval: 1000,
    });

    // Loading or Error State
    if (error || !data || !data.success) {
        return (
            <div className="flex items-center gap-4 glass p-4 rounded-3xl border border-white/5 opacity-50">
                <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                <div className="text-left space-y-1">
                    <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                    <div className="h-2 w-24 bg-white/5 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    const presence = data.data;

    // Extra safety check for presence data
    if (!presence || !presence.discord_user) return null;

    const status = presence.discord_status || "offline";

    const statusColors = {
        online: "bg-white",
        idle: "bg-white/40",
        dnd: "bg-white/70",
        offline: "bg-transparent border border-white/20",
    };

    return (
        <div className="flex items-center gap-4 glass p-4 rounded-3xl border border-white/5 transition-all hover:bg-white/5 cursor-default group">
            <div className="relative">
                <img
                    src={presence.discord_user.avatar ? `https://cdn.discordapp.com/avatars/${userId}/${presence.discord_user.avatar}.png` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
                    alt="Discord PFP"
                    className="w-10 h-10 rounded-full grayscale border border-white/10 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-black ${statusColors[status as keyof typeof statusColors] || statusColors.offline}`} />
            </div>
            <div className="text-left">
                <p className="text-xs font-black font-outfit uppercase tracking-tighter text-white">{presence.discord_user.username}</p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">
                    {presence.activities?.length > 0 ? presence.activities[0].name : status}
                </p>
            </div>
        </div>
    );
}
