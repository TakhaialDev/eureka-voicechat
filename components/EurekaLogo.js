"use client";

import Image from "next/image";

/**
 * Circular logo avatar used in the voice call UI.
 * Shows pulse rings when isCalling is true.
 * GSAP animates the .brand-logo-call wrapper (top position) — kept intact.
 */
const EurekaLogo = ({ isCalling = false }) => {
    return (
        <div className="brand-logo-call flex flex-col items-center absolute left-1/2 -translate-x-1/2 top-[18%] w-full transition-all duration-700 ease-in-out">
            {/* Outer pulse rings — visible during active call */}
            {isCalling && (
                <>
                    <span
                        className="orb-ring absolute rounded-full"
                        style={{
                            width: "13rem",
                            height: "13rem",
                            background: "rgba(142, 198, 65, 0.12)",
                            animationDelay: "0s",
                        }}
                    />
                    <span
                        className="orb-ring absolute rounded-full"
                        style={{
                            width: "11rem",
                            height: "11rem",
                            background: "rgba(142, 198, 65, 0.18)",
                            animationDelay: "0.6s",
                        }}
                    />
                </>
            )}

            {/* Logo circle */}
            <div
                className="relative w-36 h-36 sm:w-44 sm:h-44 aspect-square rounded-full overflow-hidden shadow-2xl flex items-center justify-center"
                style={{
                    border: "3px solid rgba(142, 198, 65, 0.35)",
                    background: "linear-gradient(135deg, #152210, #0d1a07)",
                    boxShadow: "0 0 40px rgba(142, 198, 65, 0.2), 0 20px 60px rgba(0,0,0,0.5)",
                }}
            >
                <Image
                    priority
                    loading="eager"
                    src="/eureka-logo-white.png"
                    alt="Eureka Kuwait"
                    width={120}
                    height={60}
                    className="w-3/4 h-auto object-contain"
                />
            </div>
        </div>
    );
};

export default EurekaLogo;
