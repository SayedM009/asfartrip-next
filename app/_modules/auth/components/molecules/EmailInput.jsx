"use client";

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

import { useEmailOtp } from "@/app/_modules/auth/hooks/useEmailOtp";
import ErrorMessage from "../atoms/ErrorMessage";
import GoogleButton from "../atoms/GoogleButton";
import SpinnerMini from "@/app/_components/ui/SpinnerMini";
import FireIcon from "@/app/_components/SVG/FireIcon";
import Points from "@/app/_components/SVG/PointsIcons";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function EmailInput({ parentSetOpen }) {
    const t = useTranslations("Login");

    const {
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
    } = useEmailOtp({
        onSuccess: () => parentSetOpen(false),
    });

    return (
        <section className="mt-10 text-center">
            <h2 className="text-xl font-semibold">{t("signin_register")}</h2>

            <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FireIcon width={16} height={16} /> {t("sub_title_one")}
                </span>
                <span className="text-xs"> | </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Points width={16} height={16} /> {t("sub_title_two")}
                </span>
            </div>

            <Input
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={handleEmailChange}
                className={`mt-4 py-6 ${
                    emailError ? "border-red-500" : "border-gray-500"
                }`}
            />

            {emailError && <ErrorMessage error={emailError} />}

            <Button
                className="w-full bg-accent-400 mt-3 py-6 text-white font-bold capitalize hover:bg-accent-500 cursor-pointer"
                onClick={handleSendOtpWithTransition}
                disabled={isPending}
            >
                {isPending ? <SpinnerMini /> : t("continue")}
            </Button>

            {/* OTP MODAL */}
            {otpOpen && (
                <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
                    <DialogContent
                        className={cn("pt-4 block w-full h-full md:h-11/12")}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-center text-xl font-semibold">
                                {t("verification_code")}
                            </DialogTitle>
                        </DialogHeader>

                        <DialogDescription className="mt-4">
                            <div className="text-center mb-4">
                                {t("short_message")} <strong>{email}</strong>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <InputOTP
                                    maxLength={OTPLENGTH}
                                    pattern={REGEXP_ONLY_DIGITS}
                                    value={otp}
                                    onChange={(val) => setOtp(val)}
                                    disabled={isVerifying}
                                >
                                    <InputOTPGroup dir="ltr">
                                        {Array.from({ length: OTPLENGTH }).map(
                                            (_, i) => (
                                                <InputOTPSlot
                                                    key={i}
                                                    index={i}
                                                    className={`${
                                                        otpError
                                                            ? "border-red-500"
                                                            : "border-gray-700"
                                                    }`}
                                                />
                                            )
                                        )}
                                    </InputOTPGroup>
                                </InputOTP>

                                {otpError && <ErrorMessage error={otpError} />}

                                <Button
                                    className="mt-4 w-50 py-5"
                                    onClick={handleVerifyOtp}
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
                                    className="mt-2 text-sm"
                                    onClick={handleResendOtp}
                                    disabled={isResending || countdown > 0}
                                >
                                    {isResending ? (
                                        <SpinnerMini />
                                    ) : countdown > 0 ? (
                                        `${t("resend_otp")} (${countdown}s)`
                                    ) : (
                                        t("resend_otp")
                                    )}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            )}

            <div className="flex items-center gap-2 mt-4 mb-2 justify-center">
                <hr className="border-t-1 w-1/2" />
                <span className="text-xs">{t("or")}</span>
                <hr className="border-t-1 w-1/2" />
            </div>

            <GoogleButton text={t("continue_google")} />
        </section>
    );
}
