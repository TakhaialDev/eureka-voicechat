"use client";

import { useFormStatus } from "react-dom";

const SubmitBtn = () => {
    const status = useFormStatus()
    const isSubmitting = status.pending
    return (
        <button className="block w-full py-4 bg-teal-600 text-white font-bold">
            {isSubmitting ? "Submitting..." : "Sign Up today"}
        </button>
    );
};

export default SubmitBtn;
