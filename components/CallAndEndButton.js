import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faPhoneSlash } from "@fortawesome/free-solid-svg-icons";

const CallAndEndButton = ({ onClick, isCalling }) => {
    return (
        <button
            onClick={onClick}
            className={`call-button flex items-center gap-3 px-3 py-3 rounded-full cursor-pointer transition-all duration-300 ${
                isCalling ? "btn-end" : "btn-call"
            }`}
        >
            <span className="inline-flex bg-white/20 rounded-full w-12 h-12 items-center justify-center shrink-0">
                <FontAwesomeIcon
                    className="icon text-white"
                    icon={isCalling ? faPhoneSlash : faPhone}
                    size="lg"
                />
            </span>
            <span className="inline-block pe-3 text-white font-semibold text-sm sm:text-base">
                {isCalling ? "End call" : "Start call"}
            </span>
        </button>
    );
};

export default CallAndEndButton;
