import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faPhoneSlash } from "@fortawesome/free-solid-svg-icons";

const CallAndEndButton = ({ onClick, isCalling }) => {
    return (
        <button
            onClick={onClick}
            className={`call-button absolute left-1/2 -translate-x-1/2 bottom-[22%] flex items-center gap-3 px-2 py-2 rounded-full cursor-pointer transition-all duration-300 shadow-lg ${
                isCalling
                    ? "bg-red-600 hover:bg-red-700"
                    : "btn-gold"
            }`}
        >
            <span className="inline-flex bg-white rounded-full w-14 h-14 items-center justify-center shrink-0">
                <FontAwesomeIcon
                    className="icon text-secondary-a1"
                    icon={isCalling ? faPhoneSlash : faPhone}
                />
            </span>
            <span className="inline-block pe-4 text-white font-semibold text-sm sm:text-base">
                {isCalling ? "End call" : "Start call"}
            </span>
        </button>
    );
};

export default CallAndEndButton;
