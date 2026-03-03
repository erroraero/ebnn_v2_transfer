"use client";

import useSWR from "swr";
import { Sun, Cloud, CloudRain, Snowflake, Moon, CloudLightning, Wind } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function WeatherWidget({ lat, lon, locationName }: { lat: number, lon: number, locationName?: string }) {
    const { data, error } = useSWR(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
        fetcher
    );

    if (error || !data) return null;

    const weather = data.current_weather;
    const isDay = weather.is_day === 1;
    const temp = Math.round(weather.temperature);

    const getSchema = (code: number) => {
        if (code === 0) return isDay ? <Sun className="w-3.5 h-3.5 text-white" /> : <Moon className="w-3.5 h-3.5 text-white" />;
        if (code <= 3) return <Cloud className="w-3.5 h-3.5 text-white/40" />;
        if (code <= 67) return <CloudRain className="w-3.5 h-3.5 text-white/60" />;
        if (code <= 77) return <Snowflake className="w-3.5 h-3.5 text-white/60" />;
        if (code <= 82) return <CloudRain className="w-3.5 h-3.5 text-white/60" />;
        if (code <= 99) return <CloudLightning className="w-3.5 h-3.5 text-white" />;
        return <Wind className="w-3.5 h-3.5 text-white/40" />;
    };

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-white/5 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-center p-1 bg-white/5 rounded-full">
                {getSchema(weather.weathercode)}
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-[9px] font-black font-outfit uppercase tracking-[0.1em] text-white">
                    {locationName || "Unknown Node"}
                </span>
                <span className="text-[10px] font-black font-outfit text-white/40 tracking-tighter">
                    {temp}°c • {isDay ? "DAYLIGHT" : "NIGHTFALL"}
                </span>
            </div>
        </div>
    );
}
