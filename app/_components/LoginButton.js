"use client";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "./ui/utils";
import Logo from "./Logo";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

function Login() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Dialog>
      <DialogTrigger className="icons-hover-600   border-1  flex text-sm px-3 py-1 rounded border-gray-500">
        {t("Login.title")}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "bg-gradient-to-b from-primary-100 to-white pt-4 ",
          "max-w-none w-full h-full rounded-none border-0 ",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
        )}
        dir={locale === "ar" && "rtl"}
      >
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            <div className="w-20">
              <Logo />
            </div>
          </DialogTitle>
          <DialogDescription>
            <section className="mt-10">
              <h2 className="text-xl text-[#121826] font-semibold">
                Sign in / Register
              </h2>
              <div>
                <span className="capitalize text-xs text-gray-400">
                  get member benefits
                </span>
                <span className="text-xs"> | </span>
                <span className="capitalize text-xs text-gray-400">
                  rewards for booking
                </span>
              </div>
              {/* Email */}
              <EmailInput />
              <div className="flex items-center gap-2 mt-4 mb-2 justify-center">
                <hr className=" border-t-1 border-gray-300 w-1/2 h-full" />
                <span className="text-xs text-gray-400">Or</span>
                <hr className=" border-t-1 border-gray-300 w-1/2 h-full" />
              </div>
              {/* Google */}
              <GoogleButton />
            </section>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function EmailInput() {
  const [email, setEmail] = useState({ email: "", error: "" });

  function handleEmailChange(e) {
    setEmail({ error: "", email: e.target.value });
  }

  async function handleSubmit() {
    if (!email.email) {
      setEmail({ ...email, error: "Please enter an email address" });
      return;
    }
    if (!validateEmail(email.email)) {
      setEmail({ ...email, error: "Please enter a valid email address" });
      return;
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email: "elsayedmoharam000@gmail.com",
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error("خطأ:", error.message, error.details);
    } else {
      console.log("نجاح:", data);
    }
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  return (
    <>
      <Input
        type="email"
        placeholder="Email"
        className={`rounded border-1 border-gray-500 mt-10 py-7 bg-white text-gray-950 ${
          email.error && "border-red-500"
        }`}
        value={email.email}
        onChange={(e) => handleEmailChange(e)}
      />
      {email.error.length > 1 && (
        <p className="text-red-500 text-xs mt-2 flex items-center gap-1 ">
          <ExclamationCircleIcon className="w-5" />
          {email.error}
        </p>
      )}

      <Dialog>
        <DialogTrigger
          className="w-full bg-accent-300 hover:bg-accent-400 mt-3 py-4 rounded font-bold text-md disabled:bg-gray-100 text-white"
          onClick={handleSubmit}
          disabled={!validateEmail(email.email) && !email.error.length}
        >
          Continue
        </DialogTrigger>
        <DialogContent
          className={cn(
            "bg-gradient-to-b from-primary-100 to-white pt-10 flex justify-start",
            "max-w-none w-full h-full rounded-none border-0 ",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-xl text-[#121826] font-semibold capitalize">
              enter verification code to sign in
            </DialogTitle>
            <DialogDescription>
              <section>
                <div>
                  We've sent a verification code to{" "}
                  <strong>{email.email}</strong>. please check your email and
                  enter it below.
                </div>
                <div className="flex justify-center my-5 w-full">
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="border-1 border-gray-700"
                      />
                      <InputOTPSlot
                        index={1}
                        className="border-1 border-gray-700"
                      />
                      <InputOTPSlot
                        index={2}
                        className="border-1 border-gray-700"
                      />
                      <InputOTPSlot
                        index={3}
                        className="border-1 border-gray-700"
                      />
                      <InputOTPSlot
                        index={4}
                        className="border-1 border-gray-700"
                      />
                      <InputOTPSlot
                        index={5}
                        className="border-1 border-gray-700"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </section>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* <Button
        className="w-full bg-accent-300 hover:bg-accent-400 mt-3 py-6 rounded font-bold text-md"
        onClick={handleSubmit}
      >
        Continue
      </Button> */}
    </>
  );
}
function GoogleButton() {
  return (
    <Button className="w-full  mt-3 py-6 border-1 bg-white font-bold text-gray-950">
      <Image src="/icons/google.jpg" alt="Google" width={20} height={20} />
      Continue with Google
    </Button>
  );
}

export default Login;
