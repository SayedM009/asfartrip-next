"use client";

import { useState } from "react";
import { sendOtp, verifyOtp, resendOtp } from "../api/services/otp";

export function useOtpActions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSend(email) {
        setLoading(true);
        setError("");

        const res = await sendOtp(email);
        if (res.errorStatus) setError(res.error);

        setLoading(false);
        return res;
    }

    async function handleVerify(email, otp) {
        setLoading(true);
        setError("");

        const res = await verifyOtp(email, otp);
        if (res.errorStatus) setError(res.error);

        setLoading(false);
        return res;
    }

    async function handleResend(email) {
        setLoading(true);
        setError("");

        const res = await resendOtp(email);
        if (res.errorStatus) setError(res.error);

        setLoading(false);
        return res;
    }

    return {
        loading,
        error,
        send: handleSend,
        verify: handleVerify,
        resend: handleResend,
    };
}
