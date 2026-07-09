import { secondsToTimeStr } from "@/helper/helper";

const OnGoingCall = ({ time, connecting }) => {
    return (
        <div className="text-center call-info opacity-0">
            <p className="text-primary-a1 text-xs uppercase tracking-widest mb-1">
                {connecting ? "Connecting" : "On call"}
            </p>
            <h2 className="font-bold text-5xl sm:text-6xl text-secondary-a1 tabular-nums">
                {connecting ? "…" : secondsToTimeStr(time)}
            </h2>
        </div>
    );
};

export default OnGoingCall;
