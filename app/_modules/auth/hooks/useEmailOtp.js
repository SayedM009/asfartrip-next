"use client";

import { useState, useEffect, useTransition } from "react";
import { validateEmail } from "@/app/_modules/auth/utils/validateEmail";
import { useOtpActions } from "@/app/_modules/auth/hooks/useOtpActions";
import { signIn } from "next-auth/react";

export function useEmailOtp({ onSuccess }) {
    const { send, verify, resend } = useOtpActions();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");

    const [otpOpen, setOtpOpen] = useState(false);

    const [isPending, startTransition] = useTransition();
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const [countdown, setCountdown] = useState(0);
    const OTPLENGTH = 6;
    const RESEND_COOLDOWN = 30;

    // =============================
    // EMAIL HANDLERS
    // =============================
    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailError("");
    }

    function validateEmailInput() {
        if (!email) {
            setEmailError("Email is required");
            return false;
        }
        if (!validateEmail(email)) {
            setEmailError("Invalid email");
            return false;
        }
        return true;
    }

    // =============================
    // SEND OTP
    // =============================
    async function handleSendOtp() {
        if (!validateEmailInput()) return;

        const action = await send(email);

        if (!action.errorStatus) {
            setOtpOpen(true);
            setCountdown(RESEND_COOLDOWN);
        } else {
            setEmailError(action.error);
        }
    }

    function handleSendOtpWithTransition() {
        startTransition(() => handleSendOtp());
    }

    // =============================
    // VERIFY OTP
    // =============================
    async function handleVerifyOtp() {
        if (!otp || otp.length < OTPLENGTH) {
            setOtpError("Please enter full OTP");
            return;
        }

        setIsVerifying(true);

        try {
            const result = await signIn("credentials", {
                email,
                otp,
                redirect: false,
            });

            if (result?.error) {
                setOtpError(result.error || "Invalid OTP");
            } else if (result?.ok) {
                setOtpOpen(false);
                if (onSuccess) onSuccess();
            }
        } catch (err) {
            setOtpError("Verification failed");
        }

        setIsVerifying(false);
    }

    // =============================
    // RESEND OTP
    // =============================
    async function handleResendOtp() {
        if (countdown > 0) return;

        setIsResending(true);
        setOtp("");
        setOtpError("");

        const action = await resend(email);

        if (action.errorStatus) {
            setOtpError(action.error);
        } else {
            setCountdown(RESEND_COOLDOWN);
        }

        setIsResending(false);
    }

    // =============================
    // COUNTDOWN TIMER
    // =============================
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    useEffect(() => {
        if (!otpOpen) setCountdown(0);
    }, [otpOpen]);

    return {
        email,
        emailError,
        handleEmailChange,
        handleSendOtpWithTransition,
        isPending,

        otp,
        setOtp,
        otpError,
        otpOpen,
        setOtpOpen,
        handleVerifyOtp,
        isVerifying,

        handleResendOtp,
        isResending,
        countdown,

        OTPLENGTH,
    };
}
