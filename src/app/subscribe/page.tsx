import SubscribeClient from "./SubscribeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sovereign Subscription | EBNN_CORE",
    description: "Synchronize your terminal with our technical broadcast frequency.",
};

export default function SubscribePage() {
    return <SubscribeClient />;
}
