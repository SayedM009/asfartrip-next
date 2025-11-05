"use client";
import { useState, useTransition, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { sendOtp, resendOtp } from "@/app/_libs/api-services";
import { validateEmail } from "@/app/_helpers/validateEmail";
import FireIcon from "../SVG/FireIcon";
import Points from "../SVG/PointsIcons";
import ErrorMessage from "./ErrorMessage";
import GoogleButton from "./GoogleButton";
import SpinnerMini from "../ui/SpinnerMini";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function EmailInput({ parentSetOpen }) {
    const [email, setEmail] = useState({ email: "", error: "" });
    const [otpOpen, setOtpOpen] = useState(false);
    const t = useTranslations("Login");

    function handleEmailChange(e) {
        setEmail({ ...email, email: e.target.value, error: "" });
    }

    return (
        <section className="mt-10 text-center">
            <h2 className="text-xl text-[#121826] font-semibold capitalize">
                {t("signin_register")}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-3">
                <span className="capitalize text-xs text-gray-500 flex items-center gap-1">
                    <FireIcon width={16} height={16} />
                    {t("sub_title_one")}
                </span>
                <span className="text-xs"> | </span>
                <span className="capitalize text-xs text-gray-500 flex items-center gap-1">
                    <Points width={16} height={16} />
                    {t("sub_title_two")}
                </span>
            </div>

            <Input
                type="email"
                placeholder={t("email")}
                className={`rounded border-1 border-gray-500 mt-4 py-6 bg-white text-gray-950 ${
                    email.error && "border-red-500"
                }`}
                value={email.email}
                onChange={handleEmailChange}
            />
            {email.error && <ErrorMessage error={email.error} />}

            <CredentialActions
                email={email}
                setEmail={setEmail}
                otpOpen={otpOpen}
                setOtpOpen={setOtpOpen}
                parentSetOpen={parentSetOpen}
            />
            <div className="flex items-center gap-2 mt-4 mb-2 justify-center">
                <hr className="border-t-1 border-gray-300 w-1/2 h-full" />
                <span className="text-xs text-gray-400">{t("or")}</span>
                <hr className="border-t-1 border-gray-300 w-1/2 h-full" />
            </div>
            <GoogleButton text={t("continue_google")} />
        </section>
    );
}

function CredentialActions({
    email,
    setEmail,
    otpOpen,
    setOtpOpen,
    parentSetOpen,
}) {
    const [otp, setOtp] = useState({ OTP: "", error: "" });
    const [isPending, startTransition] = useTransition();
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const t = useTranslations("Login");
    const OTPLENGTH = 6;
    const RESEND_COOLDOWN = 30; // 30 seconds

    // Timer for resend cooldown
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Reset countdown when dialog closes
    useEffect(() => {
        if (!otpOpen) {
            setCountdown(0);
        }
    }, [otpOpen]);

    async function handleSendOTP() {
        if (!validateEmail(email.email)) {
            setEmail({ ...email, error: t("invalid_email") });
            return;
        }

        const action = await sendOtp(email.email);

        if (!action.errorStatus) {
            setOtpOpen(true);
            setCountdown(RESEND_COOLDOWN); // Start countdown
        } else {
            setEmail({ ...email, error: action.error });
        }
    }

    function handleSendOTPWithTransition() {
        if (!email.email) {
            setEmail({ ...email, error: t("empty_email") });
            return;
        }
        if (!validateEmail(email.email)) {
            setEmail({ ...email, error: t("invalid_email") });
            return;
        }
        startTransition(() => handleSendOTP());
    }

    async function handleVerifyOTP() {
        if (!otp.OTP || otp.OTP.length < OTPLENGTH) {
            setOtp({ ...otp, error: t("empty_otp") || "Please enter OTP" });
            return;
        }

        setIsVerifying(true);

        try {
            const result = await signIn("credentials", {
                email: email.email,
                otp: otp.OTP,
                redirect: false,
            });

            if (result?.error) {
                setOtp({ ...otp, error: result.error || t("invalid_otp") });
            } else if (result?.ok) {
                setOtpOpen(false);
                parentSetOpen(false);
            }
        } catch (error) {
            setOtp({
                ...otp,
                error: t("verification_failed") || "Verification failed",
            });
        } finally {
            setIsVerifying(false);
        }
    }

    async function handleResendOTP() {
        if (countdown > 0) return; // Prevent resend if countdown is active

        setIsResending(true);
        setOtp({ OTP: "", error: "" });

        const action = await resendOtp(email.email);

        if (action.errorStatus) {
            setOtp({ ...otp, error: action.error });
        } else {
            setOtp({ ...otp, error: "" });
            setCountdown(RESEND_COOLDOWN); // Restart countdown
        }

        setIsResending(false);
    }

    const canResend = countdown === 0 && !isResending;

    return (
        <>
            <Button
                className="w-full bg-accent-400 capitalize hover:bg-accent-300 mt-3 py-6 rounded font-bold text-md text-white flex justify-center cursor-pointer"
                onClick={handleSendOTPWithTransition}
                disabled={isPending}
            >
                {isPending ? <SpinnerMini /> : t("continue")}
            </Button>

            {otpOpen && (
                <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
                    <DialogContent
                        className={cn(
                            "bg-gradient-to-b from-primary-100 to-white pt-4 block",
                            "max-w-none w-full h-full rounded-none border-0 md:h-11/12 md:rounded",
                            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
                            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
                        )}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-center text-xl font-semibold">
                                {t("verification_code")}
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="mt-4">
                            <div className="text-center mb-4">
                                {t("short_message")}
                                <strong> {email.email}</strong>
                            </div>
                            <div className="flex justify-center flex-col items-center gap-2">
                                <InputOTP
                                    maxLength={OTPLENGTH}
                                    pattern={REGEXP_ONLY_DIGITS}
                                    value={otp.OTP}
                                    onChange={(value) =>
                                        setOtp({ OTP: value, error: "" })
                                    }
                                    disabled={isVerifying}
                                >
                                    <InputOTPGroup className="w-91" dir="ltr">
                                        {Array.from({ length: OTPLENGTH }).map(
                                            (_, i) => (
                                                <InputOTPSlot
                                                    key={i}
                                                    index={i}
                                                    type="tel"
                                                    className={`border-1 ${
                                                        otp.error
                                                            ? "border-red-500"
                                                            : "border-gray-700"
                                                    } w-1/6`}
                                                />
                                            )
                                        )}
                                    </InputOTPGroup>
                                </InputOTP>
                                {otp.error && (
                                    <ErrorMessage error={otp.error} />
                                )}

                                <Button
                                    className="mt-4 w-full rounded py-5 capitalize"
                                    onClick={handleVerifyOTP}
                                    disabled={isVerifying}
                                >
                                    {isVerifying ? (
                                        <SpinnerMini />
                                    ) : (
                                        t("submit")
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="mt-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleResendOTP}
                                    disabled={!canResend}
                                >
                                    {isResending ? (
                                        <SpinnerMini />
                                    ) : countdown > 0 ? (
                                        `${
                                            t("resend_otp") || "Resend OTP"
                                        } (${countdown}s)`
                                    ) : (
                                        t("resend_otp") || "Resend OTP"
                                    )}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
