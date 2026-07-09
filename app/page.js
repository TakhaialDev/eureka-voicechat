import PhoneCalling from "@/components/PhoneCalling";

const page = async () => {
    return (
        <main className="min-h-screen bg-secondary-a1 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
            <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34, 197, 94, 0.35), transparent)",
                }}
            />
            <div className="relative z-10 w-full max-w-lg text-center mb-6">
                <p className="text-primary-a1 text-xs font-bold tracking-[0.25em] uppercase mb-2">
                    Voice Assistant
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Eureka Kuwait
                </h1>
                <p className="text-white/55 text-sm mt-2 max-w-sm mx-auto">
                    Kuwait's Electronics Store
                </p>
            </div>
            <div className="relative z-10 w-full max-w-lg">
                <PhoneCalling />
            </div>
        </main>
    );
};

export default page;
