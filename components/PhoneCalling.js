"use client";

import { useEffect, useRef, useState } from "react";
import CallAndEndButton from "./CallAndEndButton";
import EurekaLogo from "./EurekaLogo";
import gsap from "gsap";
import OnGoingCall from "./OnGoingCall";
import { useConversation } from "@11labs/react";

async function fetchSignedConversationUrl() {
    const response = await fetch("/api/conversation-url");
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Failed to start voice session.");
    }
    return data.signed_url;
}

function isAndroid() {
    return typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
}

const ANDROID_HANDOFF_AFTER_RING_MS = 450;
const RINGTONE_SRC = "/ringtone.mp3";

const PhoneCalling = () => {
    const [isCalling, setIsCalling] = useState(null);
    const [time, setTime] = useState(0);
    const [token, setToken] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const audioElement = useRef(null);
    const mediaRef = useRef(null);
    const sessionStartedRef = useRef(false);
    const ringDoneRef = useRef(Promise.resolve());

    const tl = useRef(gsap.timeline());
    const timeline = tl.current;

    const stopRingtone = () => {
        const audio = audioElement.current;
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    };

    const stopMic = () => {
        mediaRef.current?.getTracks().forEach((track) => track.stop());
        mediaRef.current = null;
    };

    const closeConnection = () => {
        console.log("Disconnected");
        setIsCalling(false);
    };

    /** Must be called synchronously inside the user's tap/click handler. */
    const playRingtoneOnceFromUserTap = () => {
        const audio = audioElement.current ?? new Audio(RINGTONE_SRC);
        if (!audioElement.current) {
            audioElement.current = audio;
        }

        ringDoneRef.current = new Promise((resolve) => {
            let settled = false;
            const finish = () => {
                if (settled) return;
                settled = true;
                audio.removeEventListener("ended", finish);
                resolve();
            };

            audio.loop = false;
            audio.currentTime = 0;
            audio.addEventListener("ended", finish);
            const playPromise = audio.play();
            if (playPromise) {
                playPromise.catch((err) => {
                    console.warn("Ringtone play blocked:", err);
                    finish();
                });
            }
            setTimeout(finish, 2200);
        });
    };

    const conversation = useConversation({
        connectionDelay: {
            android: 800,
            ios: 0,
            default: 0,
        },
        onConnect: () => {
            stopRingtone();
            setConnecting(false);
            console.log("Connected");
        },
        onDisconnect: () => {
            stopMic();
            sessionStartedRef.current = false;
            closeConnection();
        },
        onMessage: (message) => console.log("Message:", message),
        onError: (error) => console.error("Error:", error),
    });

    useEffect(() => {
        if (!isCalling) {
            setConnecting(false);
            setToken(null);
            return;
        }

        setConnecting(true);

        let cancelled = false;
        fetchSignedConversationUrl()
            .then((url) => {
                if (!cancelled) setToken(url);
            })
            .catch((err) => {
                console.error(err);
                stopRingtone();
                alert(err.message || "Could not start the call. Please try again.");
                setIsCalling(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isCalling]);

    useEffect(() => {
        let cancelled = false;

        async function syncSession() {
            if (!isCalling) {
                stopRingtone();
                stopMic();
                sessionStartedRef.current = false;
                try {
                    await conversation.endSession();
                } catch {
                    // already closed
                }
                return;
            }

            if (!token || sessionStartedRef.current) return;

            await ringDoneRef.current;
            stopMic();

            if (isAndroid()) {
                await new Promise((resolve) =>
                    setTimeout(resolve, ANDROID_HANDOFF_AFTER_RING_MS)
                );
            }
            if (cancelled || !isCalling) return;

            sessionStartedRef.current = true;
            await conversation.startSession({ signedUrl: token });
        }

        syncSession().catch((err) => {
            console.error(err);
            sessionStartedRef.current = false;
            alert("Could not connect the voice call. Please try again.");
            setIsCalling(false);
        });

        return () => {
            cancelled = true;
        };
    }, [isCalling, token]);

    useEffect(() => {
        let timer = null;
        if (isCalling && !connecting) {
            timer = setInterval(() => setTime((prev) => prev + 1), 1000);
        } else {
            setTime(0);
        }
        return () => clearInterval(timer);
    }, [isCalling, connecting]);

    useEffect(() => {
        timeline.pause();
        timeline.to(".brand-logo-call", { y: -60 });
        timeline.to(".call-button", { y: 60 }, "<");
        timeline.to(".call-button .icon", { rotate: 135 }, "<");
        timeline.to(".call-info", { opacity: 1 });
    }, [timeline]);

    useEffect(() => {
        if (isCalling) {
            timeline.play();
        } else if (isCalling === false) {
            timeline.reverse();
        }
    }, [isCalling, timeline]);

    const clickHandler = () => {
        if (isCalling) {
            setIsCalling(false);
            return;
        }

        // Play ring on the same user gesture — required on Android/iOS.
        playRingtoneOnceFromUserTap();

        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((media) => {
                mediaRef.current = media;
                setIsCalling(true);
            })
            .catch((err) => {
                stopRingtone();
                alert(`${err}, please allow mic permission`);
            });
    };

    return (
        <section className="w-full mx-auto flex flex-col">
            <div className="relative flex flex-col items-center justify-center gap-6 py-14 overflow-hidden">
                <EurekaLogo isCalling={!!isCalling} />
                <CallAndEndButton isCalling={isCalling} onClick={clickHandler} />
                {!isCalling && !connecting && (
                    <a
                        href="https://eureka-chat.takhaial.com/"
                        className="btn-outline-primary px-6 py-2.5 text-sm whitespace-nowrap rounded-full"
                    >
                        Go to Chat
                    </a>
                )}
                {/* Timer is absolutely centered so it never affects flex spacing */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <OnGoingCall time={time} connecting={connecting} />
                </div>
            </div>
            <audio ref={audioElement} preload="auto" playsInline loop={false}>
                <source src={RINGTONE_SRC} type="audio/mpeg" />
            </audio>
        </section>
    );
};

export default PhoneCalling;
