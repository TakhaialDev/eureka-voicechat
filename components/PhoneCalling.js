"use client";

import { useEffect, useRef, useState } from "react";
import CallAndEndButton from "./CallAndEndButton";
import EurekaLogo from "./EurekaLogo";
import gsap from "gsap";
import OnGoingCall from "./OnGoingCall";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { Conversation } from "@11labs/client";

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

/**
 * Android Chrome routes audio output through whichever mic device is active:
 * "Default" maps to the earpiece, "Speakerphone" to the loud speaker. Opening a
 * (muted) stream on the Speakerphone device locks the call to loudspeaker.
 * Returns the priming stream (keep alive during the call) or null.
 */
async function primeSpeakerphoneOnAndroid() {
    if (!isAndroid()) return null;
    try {
        if ("audioSession" in navigator) {
            navigator.audioSession.type = "play-and-record";
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const speakerDev = devices.find((d) => d.kind === "audioinput" && /speaker/i.test(d.label));
        if (!speakerDev?.deviceId) return null;
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: { exact: speakerDev.deviceId } },
        });
        stream.getAudioTracks().forEach((t) => { t.enabled = false; });
        return stream;
    } catch (err) {
        console.warn("[audio] Android speakerphone prime failed:", err);
        return null;
    }
}

/** Mute a live mic stream. Playback (the agent's voice) stays audible. */
function setMicStreamMuted(stream, muted) {
    try {
        const tracks = stream?.getAudioTracks().filter((track) => track.readyState === "live") ?? [];
        if (!tracks.length) return false;
        tracks.forEach((track) => {
            track.enabled = !muted;
        });
        return true;
    } catch (err) {
        console.warn("Failed to toggle mic mute:", err);
        return false;
    }
}

/** Mute the live mic owned by the ElevenLabs session. */
function setConversationMicMuted(conversation, muted) {
    return setMicStreamMuted(conversation?.input?.inputStream, muted);
}

const PhoneCalling = () => {
    const [isCalling, setIsCalling] = useState(null);
    const [time, setTime] = useState(0);
    const [token, setToken] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioElement = useRef(null);
    const mediaRef = useRef(null);
    const speakerPrimingRef = useRef(null); // Android speaker-lock stream
    const sessionStartedRef = useRef(false);
    const ringDoneRef = useRef(Promise.resolve());
    const conversationRef = useRef(null);
    const mutedRef = useRef(false);

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
        speakerPrimingRef.current?.getTracks().forEach((t) => t.stop());
        speakerPrimingRef.current = null;
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
                mutedRef.current = false;
                setIsMuted(false);
                const conv = conversationRef.current;
                conversationRef.current = null;
                if (conv) {
                    try { await conv.endSession(); } catch { /* already closed */ }
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

            // Lock Android audio output to the loudspeaker before ElevenLabs opens its own audio.
            speakerPrimingRef.current = await primeSpeakerphoneOnAndroid();
            if (cancelled || !isCalling) return;

            sessionStartedRef.current = true;
            const conv = await Conversation.startSession({
                signedUrl: token,
                onConnect: () => {
                    stopRingtone();
                    setConnecting(false);
                    if (mutedRef.current) setConversationMicMuted(conversationRef.current, true);
                },
                onDisconnect: () => {
                    stopMic();
                    conversationRef.current = null;
                    sessionStartedRef.current = false;
                    mutedRef.current = false;
                    setIsMuted(false);
                    closeConnection();
                },
                onMessage: (msg) => console.log("Message:", msg),
                onError: (err) => console.error("Error:", err),
            });
            if (cancelled) {
                sessionStartedRef.current = false;
                conv.endSession().catch(() => {});
                return;
            }
            conversationRef.current = conv;
            if (mutedRef.current) setConversationMicMuted(conv, true);
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
        timeline.to(".call-button .icon", { rotate: 135 });
        timeline.to(".call-info", { opacity: 1 }, "<");
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
        // Mark this as a communication session inside the user gesture (earpiece vs speaker hint).
        if ("audioSession" in navigator) {
            navigator.audioSession.type = "play-and-record";
        }

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

    const toggleMute = () => {
        if (!isCalling) return;
        const next = !mutedRef.current;
        mutedRef.current = next;
        setIsMuted(next);
        const previewMuted = setMicStreamMuted(mediaRef.current, next);
        const applied = setConversationMicMuted(conversationRef.current, next);
        if (!previewMuted && !applied && next) console.log("Mute queued until mic stream is ready");
    };

    return (
        <section className="w-full mx-auto flex flex-col">
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <EurekaLogo isCalling={!!isCalling} />
                <OnGoingCall time={time} connecting={connecting} />
                <CallAndEndButton isCalling={isCalling} onClick={clickHandler} />
                {isCalling && (
                    <button
                        type="button"
                        onClick={toggleMute}
                        aria-pressed={isMuted}
                        className="btn-outline-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm whitespace-nowrap rounded-full"
                    >
                        <FontAwesomeIcon icon={isMuted ? faMicrophoneSlash : faMicrophone} />
                        {isMuted ? "Unmute microphone" : "Mute microphone"}
                    </button>
                )}
                {!isCalling && !connecting && (
                    <a
                        href="https://chat-eureka.takhaial.com/"
                        className="btn-outline-primary px-6 py-2.5 text-sm whitespace-nowrap rounded-full"
                    >
                        Go to Chat
                    </a>
                )}
            </div>
            <audio ref={audioElement} preload="auto" playsInline loop={false}>
                <source src={RINGTONE_SRC} type="audio/mpeg" />
            </audio>
        </section>
    );
};

export default PhoneCalling;
