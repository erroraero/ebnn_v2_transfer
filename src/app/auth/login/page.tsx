import { Metadata } from "next";
import LoginClient from "./LoginClient";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Terminal Access | EBNN",
    description: "Secure Command Center Authentication",
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white/20 uppercase font-black tracking-widest text-[10px]">Synchronizing Terminal...</div>}>
            <LoginClient />
        </Suspense>
    );
}
