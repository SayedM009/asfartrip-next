"use client";
import { useState, useTransition } from "react";
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
import { sendOtp, verifyOtp } from "@/app/_libs/api-services";
import { validateEmail } from "@/app/_helpers/validateEmail";
import FireIcon from "../SVG/FireIcon";
import Points from "../SVG/PointsIcons";
import ErrorMessage from "./ErrorMessage";
import GoogleButton from "./GoogleButton";
import SpinnerMini from "../SpinnerMini";
import { cn } from "@/lib/utils";

export default function EmailInput({ parentSetOpen }) {
  const [email, setEmail] = useState({ email: "", error: "" });
  const [otpOpen, setOtpOpen] = useState(false);

  function handleEmailChange(e) {
    setEmail({ ...email, email: e.target.value, error: "" });
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl text-[#121826] font-semibold ">
        Sign in / Register
      </h2>
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="capitalize text-xs text-gray-500 flex items-center gap-1">
          <FireIcon width={16} height={16} />
          get member benefits
        </span>
        <span className="text-xs"> | </span>
        <span className="capitalize text-xs text-gray-500 flex items-center gap-1">
          <Points width={16} height={16} />
          rewards for booking
        </span>
      </div>

      <Input
        type="email"
        placeholder="Email"
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
        <span className="text-xs text-gray-400">Or</span>
        <hr className="border-t-1 border-gray-300 w-1/2 h-full" />
      </div>
      <GoogleButton />
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
  const OTPLENGTH = 6;

  async function handleSendOTP() {
    if (!validateEmail(email.email)) return;
    const action = await sendOtp(email.email);
    if (!action.errorStatus) setOtpOpen(true);
    else setEmail({ ...email, error: action.error });
  }

  function handleSendOTPWithTransition() {
    if (!email.email) {
      setEmail({ ...email, error: "Please enter an email address" });
      return;
    }
    if (!validateEmail(email.email)) {
      setEmail({ ...email, error: "Please enter a valid email address" });
      return;
    }
    startTransition(() => handleSendOTP());
  }

  async function handleVerifyOTP() {
    if (!otp.OTP || otp.OTP.length < OTPLENGTH) {
      setOtp({ ...otp, error: "Please enter an OTP" });
      return;
    }

    const verify = await verifyOtp(email.email, otp.OTP);
    if (!verify?.errorStatus) {
      setOtpOpen(false);
      parentSetOpen(false);
    } else {
      setOtp({ ...otp, error: verify.error || "Verification failed" });
    }
  }

  return (
    <>
      <Button
        className="w-full bg-accent-400 hover:bg-accent-300 mt-3 py-6 rounded font-bold text-md text-white flex justify-center cursor-pointer"
        onClick={handleSendOTPWithTransition}
        disabled={isPending}
      >
        {isPending ? <SpinnerMini /> : "Continue"}
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
                Enter verification code
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="mt-4">
              <div className="text-center mb-4">
                We&apos;ve sent a verification code to{" "}
                <strong>{email.email}</strong>
              </div>
              <div className="flex justify-center flex-col items-center gap-2 ">
                <InputOTP
                  maxLength={OTPLENGTH}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp.OTP}
                  onChange={(value) => setOtp({ OTP: value, error: "" })}
                  className="bg-red-900"
                >
                  <InputOTPGroup className="flex justify-center  ">
                    {Array.from({ length: OTPLENGTH }).map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        type="tel"
                        className={`border flex-1 ${
                          otp.error ? "border-red-500" : "border-gray-700"
                        }`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {otp.error && <ErrorMessage error={otp.error} />}
                <Button className="w-1/2  mt-4" onClick={handleVerifyOTP}>
                  Submit
                </Button>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
