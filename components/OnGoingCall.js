import { secondsToTimeStr } from "@/helper/helper";

const OnGoingCall = ({ time, connecting }) => {
    return (
        <div className="text-center call-info opacity-0">
            <p
                className="text-xs uppercase tracking-widest mb-1 font-semibold"
                style={{ color: "var(--primary)" }}
            >
                {connecting ? "Connecting" : "On call"}
            </p>
            <h2
                className="font-bold text-5xl sm:text-6xl tabular-nums"
                style={{ color: "var(--foreground)" }}
            >
                {connecting ? "…" : secondsToTimeStr(time)}
            </h2>
        </div>
    );
};

export default OnGoingCall;
