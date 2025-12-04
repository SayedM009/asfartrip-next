"use client";

import { useState, useEffect, useTransition } from "react";
import { validateEmail } from "@/app/_modules/auth/utils/validateEmail";
import { useOtpActions } from "@/app/_modules/auth/hooks/useOtpActions";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

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

    const t = useTranslations("Login")

    // =============================
    // EMAIL HANDLERS
    // =============================
    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailError("");
    }

    function validateEmailInput() {
        if (!email) {
            setEmailError(t("empty_email"));
            return false;
        }
        if (!validateEmail(email)) {
            setEmailError(t("invalid_email"));
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
            setOtpError(t("empty_otp"));
            return;
        }

        setIsVerifying(true);

        try {
            // Step 1: Verify OTP and get user data
            const verifyResult = await verify(email, otp);

            if (verifyResult.errorStatus) {
                setOtpError(verifyResult.error || "Invalid OTP");
                setIsVerifying(false);
                return;
            }

            // Step 2: Sign in with the received token
            const user = verifyResult.data?.user;
            if (!user || !user.api_token) {
                setOtpError("Invalid user data received");
                setIsVerifying(false);
                return;
            }

            const signInResult = await signIn("credentials", {
                email,
                token: user.api_token,
                userData: JSON.stringify(user),
                redirect: false,
            });

            if (signInResult?.error) {
                setOtpError(signInResult.error || "Sign in failed");
            } else if (signInResult?.ok) {
                setOtpOpen(false);
                if (onSuccess) onSuccess();
            } else {
                setOtpError("Sign in failed");
            }
        } catch (err) {
            console.error("Sign in error:", err);
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
