"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Sun, Moon, MessageSquare } from "lucide-react";
import PhoneCalling from "@/components/PhoneCalling";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: ((i * 137.5) % 100).toFixed(1),
    y: ((i * 93.7) % 100).toFixed(1),
    size: ((i % 3) + 1).toFixed(0),
    dur: (((i * 7) % 12) + 10).toFixed(0),
    delay: ((i * 3.3) % 9).toFixed(1),
}));

const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_AGENT_URL || "https://chat-eureka.takhaial.com/";

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="h-9 w-9" />;
    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent)] transition-all"
            aria-label="Toggle theme"
            style={{ color: "var(--foreground)" }}
        >
            {resolvedTheme === "dark" ? (
                <Sun size={16} />
            ) : (
                <Moon size={16} />
            )}
        </button>
    );
}

function BackgroundEffects({ isDark }) {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {isDark ? (
                <>
                    <div
                        className="absolute inset-0 opacity-60"
                        style={{
                            background:
                                "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(142, 198, 65, 0.12), transparent)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            left: "-6rem",
                            top: "-6rem",
                            width: "20rem",
                            height: "20rem",
                            borderRadius: "50%",
                            background: "rgba(142, 198, 65, 0.06)",
                            filter: "blur(110px)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            right: "-6rem",
                            bottom: 0,
                            width: "18rem",
                            height: "18rem",
                            borderRadius: "50%",
                            background: "rgba(90, 138, 31, 0.08)",
                            filter: "blur(90px)",
                        }}
                    />
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {PARTICLES.map((p) => (
                            <span
                                key={p.id}
                                className="particle absolute rounded-full"
                                style={{
                                    left: `${p.x}%`,
                                    top: `${p.y}%`,
                                    width: `${p.size}px`,
                                    height: `${p.size}px`,
                                    background: "rgba(142, 198, 65, 0.25)",
                                    animationDuration: `${p.dur}s`,
                                    animationDelay: `${p.delay}s`,
                                }}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div
                        style={{
                            position: "absolute",
                            right: "-8rem",
                            top: "-8rem",
                            width: "24rem",
                            height: "24rem",
                            borderRadius: "50%",
                            background: "rgba(142, 198, 65, 0.2)",
                            filter: "blur(120px)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            left: "-8rem",
                            bottom: 0,
                            width: "20rem",
                            height: "20rem",
                            borderRadius: "50%",
                            background: "rgba(190, 230, 130, 0.25)",
                            filter: "blur(100px)",
                        }}
                    />
                </>
            )}
        </div>
    );
}

export default function Page() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const isDark = !mounted || resolvedTheme === "dark";
    const logoSrc = isDark ? "/eureka-logo-white.png" : "/eureka-logo-green.png";

    return (
        <div
            className="relative min-h-screen overflow-hidden"
            style={{ background: "var(--background)" }}
        >
            <BackgroundEffects isDark={isDark} />

            {/* Header */}
            <header
                className="relative z-20 flex h-14 shrink-0 items-center justify-between px-4"
                style={{
                    borderBottom: "1px solid var(--border)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    backgroundColor: isDark ? "rgba(13, 26, 7, 0.8)" : "rgba(244, 248, 238, 0.8)",
                }}
            >
                {/* Chat link */}
                <a
                    href={CHAT_URL}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all"
                    style={{
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        color: "var(--foreground)",
                    }}
                    title="Switch to Chat Agent"
                >
                    <MessageSquare size={16} style={{ color: "var(--primary)" }} />
                    <span className="hidden sm:inline">Chat Agent</span>
                </a>

                {/* Logo — absolutely centered so it's always in the exact middle */}
                {mounted && (
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <Image
                            src={logoSrc}
                            alt="Eureka"
                            width={110}
                            height={34}
                            className="h-8 w-auto object-contain"
                            priority
                        />
                    </div>
                )}

                <ThemeToggle />
            </header>

            {/* Main content */}
            <main className="relative z-10 flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-8">
                <div className="w-full max-w-lg">
                    {/* Title section */}
                    <div className="text-center mb-6">
                        <p
                            className="text-xs font-bold tracking-[0.25em] uppercase mb-2"
                            style={{ color: "var(--primary)" }}
                        >
                            Voice Assistant
                        </p>
                        <h1
                            className="text-2xl sm:text-3xl font-bold tracking-tight"
                            style={{ color: "var(--foreground)" }}
                        >
                            Eureka Kuwait
                        </h1>
                        <p
                            className="text-sm mt-2 max-w-sm mx-auto"
                            style={{ color: "var(--muted-foreground)" }}
                        >
                            Kuwait&apos;s Electronics Megastore — speak with our AI assistant
                        </p>
                    </div>

                    {/* Glassmorphism card */}
                    <div
                        className="rounded-3xl shadow-2xl"
                        style={{
                            border: "1px solid var(--border)",
                            background: isDark ? "rgba(21, 34, 16, 0.85)" : "rgba(232, 244, 216, 0.85)",
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                        }}
                    >
                        <PhoneCalling />
                    </div>

                    <p
                        className="mt-5 text-center text-xs"
                        style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
                    >
                        Powered by <span className="font-semibold" style={{ color: "var(--foreground)", opacity: 1 }}>Takhaial AI</span>
                    </p>
                </div>
            </main>
        </div>
    );
}
