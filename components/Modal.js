"use client";
import { useEffect } from "react";
import Overlay from "./Overlay";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ModalContent = ({ children, onClose }) => {
    useEffect(() => {
        document.documentElement.style.overflow = "hidden";
        document.body.style.userSelect = "none";
        return () => {
            document.documentElement.style.overflowY = "auto";
            document.body.style.userSelect = "auto";
        };
    });
    return (
        <>
            <button
                onClick={onClose}
                type="button"
                className="fixed z-[300] p-3 top-5 right-7 text-4xl text-white font-semibold"
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <div
                className={`w-full fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[300] select-text`}
            >
                {children}
            </div>
            <Overlay zIndex={200} onClick={onClose} />
        </>
    );
};

const Modal = ({ children, onClose }) => {
    return createPortal(
        <ModalContent onClose={onClose}>{children}</ModalContent>,
        document.body
    );
};

export default Modal;
