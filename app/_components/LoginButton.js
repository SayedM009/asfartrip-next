// "use client";

// import { useState, useTransition } from "react";
// import { Button } from "@/components/ui/button";
// import { useTranslations } from "next-intl";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { cn } from "./ui/utils";

// import { Input } from "@/components/ui/input";

// import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";
// import { REGEXP_ONLY_DIGITS } from "input-otp";
// import { sendOtp, verifyOtp } from "../_libs/api-services";
// import { auth } from "../_libs/auth";
// import SpinnerMini from "./SpinnerMini";
// import Logo from "./Logo";
// import Image from "next/image";

// export default function AuthAction() {
//   const t = useTranslations();
//   const [open, setOpen] = useState(false);
//   return (
//     <div>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button
//             variant="outline"
//             className="icons-hover-600 border-1 flex text-sm px-3 py-0 rounded border-gray-500"
//           >
//             {t("Login.title")}
//           </Button>
//         </DialogTrigger>

//         <DialogContent
//           className={cn(
//             "bg-gradient-to-b from-primary-100 to-white pt-4",
//             "max-w-none w-full h-full rounded-none border-0  md:h-11/12 md:rounded",
//             "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
//             "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
//           )}
//         >
//           <DialogHeader>
//             <DialogTitle className="flex justify-center">
//               <div className="w-20">
//                 <Logo />
//               </div>
//             </DialogTitle>

//             <DialogDescription>
//               <EmailInput parentSetOpen={setOpen} />
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// function EmailInput({ parentSetOpen }) {
//   const [email, setEmail] = useState({ email: "", error: "" });
//   const [otpOpen, setOtpOpen] = useState(false);

//   function handleEmailChange(e) {
//     setEmail({ ...email, email: e.target.value, error: "" });
//   }

//   return (
//     <section className="mt-10">
//       <h2 className="text-xl text-[#121826] font-semibold">
//         Sign in / Register
//       </h2>
//       <div>
//         <span className="capitalize text-xs text-gray-400">
//           get member benefits
//         </span>
//         <span className="text-xs"> | </span>
//         <span className="capitalize text-xs text-gray-400">
//           rewards for booking
//         </span>
//       </div>

//       <Input
//         type="email"
//         placeholder="Email"
//         className={`rounded border-1 border-gray-500 mt-4 py-6 bg-white text-gray-950 ${
//           email.error && "border-red-500"
//         }`}
//         value={email.email}
//         onChange={handleEmailChange}
//       />
//       {email.error && <ErrorMessage error={email.error} />}

//       <CredentialActions
//         email={email}
//         setEmail={setEmail}
//         otpOpen={otpOpen}
//         setOtpOpen={setOtpOpen}
//         parentSetOpen={parentSetOpen}
//       />
//       <div className="flex items-center gap-2 mt-4 mb-2 justify-center">
//         <hr className="border-t-1 border-gray-300 w-1/2 h-full" />
//         <span className="text-xs text-gray-400">Or</span>
//         <hr className="border-t-1 border-gray-300 w-1/2 h-full" />
//       </div>
//       <GoogleButton />
//     </section>
//   );
// }

// function GoogleButton() {
//   return (
//     <Button className="w-full mt-3 py-6 border-1 bg-white font-bold text-gray-950 flex items-center justify-center gap-2">
//       <Image src="/icons/google.jpg" alt="Google" width={20} height={20} />
//       Continue with Google
//     </Button>
//   );
// }

// function ErrorMessage({ error }) {
//   return (
//     <span className="text-red-500 text-xs mt-2 flex items-center gap-1">
//       <ExclamationCircleIcon className="w-4" />
//       {error}
//     </span>
//   );
// }

// function CredentialActions({
//   email,
//   setEmail,
//   otpOpen,
//   setOtpOpen,
//   parentSetOpen,
// }) {
//   const [otp, setOtp] = useState({ OTP: "", error: "" });
//   const [isPending, startTransition] = useTransition();
//   const OTPLENGTH = 6;

//   function validateEmail(email) {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   }

//   async function handleSendOTP() {
//     if (validateEmail(email.email)) {
//       const action = await sendOtp(email.email);
//       if (!action.errorStatus) {
//         setOtpOpen(true);
//       } else {
//         console.error(action.error);
//       }
//     }
//   }

//   function handleSendOTPWithTransition() {
//     if (!email.email) {
//       setEmail({ ...email, error: "Please enter an email address" });
//       return;
//     }
//     if (!validateEmail(email.email)) {
//       setEmail({ ...email, error: "Please enter a valid email address" });
//       return;
//     }
//     startTransition(() => handleSendOTP());
//   }

//   async function handleVerifyOTP() {
//     if (!otp.OTP || otp.OTP.length < OTPLENGTH) {
//       setOtp({ ...otp, error: "Please enter an OTP" });
//       return;
//     }

//     const verify = await verifyOtp(email.email, otp.OTP);
//     if (!verify?.errorStatus) {
//       setOtpOpen(false);
//       parentSetOpen(false);
//     } else {
//       setOtp({ ...otp, error: verify.error || "Verification failed" });
//     }
//   }

//   return (
//     <>
//       <Button
//         className="w-full bg-accent-400 hover:bg-accent-300 mt-3 py-6 rounded font-bold text-md text-white flex justify-center cursor-pointer"
//         onClick={handleSendOTPWithTransition}
//         disabled={isPending}
//       >
//         {isPending ? <SpinnerMini /> : "Continue"}
//       </Button>

//       {otpOpen && (
//         <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
//           <DialogContent
//             className={cn(
//               "bg-gradient-to-b from-primary-100 to-white pt-4 block",
//               "max-w-none w-full h-full rounded-none border-0 md:h-11/12 md:rounded",
//               "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
//               "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
//             )}
//           >
//             <DialogHeader>
//               <DialogTitle className="text-center text-xl font-semibold">
//                 Enter verification code
//               </DialogTitle>
//             </DialogHeader>
//             <DialogDescription className="mt-4">
//               <div className="text-center mb-4">
//                 We&apos;ve sent a verification code to{" "}
//                 <strong>{email.email}</strong>
//               </div>
//               <div className="flex justify-center flex-col items-center gap-2 ">
//                 <InputOTP
//                   maxLength={OTPLENGTH}
//                   pattern={REGEXP_ONLY_DIGITS}
//                   value={otp.OTP}
//                   onChange={(value) => setOtp({ OTP: value, error: "" })}
//                   className="bg-red-900"
//                 >
//                   <InputOTPGroup className="flex justify-center  ">
//                     {Array.from({ length: OTPLENGTH }).map((_, i) => (
//                       <InputOTPSlot
//                         key={i}
//                         index={i}
//                         type="tel"
//                         className={`border flex-1 ${
//                           otp.error ? "border-red-500" : "border-gray-700"
//                         }`}
//                       />
//                     ))}
//                   </InputOTPGroup>
//                 </InputOTP>
//                 {otp.error && <ErrorMessage error={otp.error} />}
//                 <Button className="w-1/2  mt-4" onClick={handleVerifyOTP}>
//                   Submit
//                 </Button>
//               </div>
//             </DialogDescription>
//           </DialogContent>
//         </Dialog>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "./ui/utils";
import { Input } from "@/components/ui/input";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  sendOtpAction,
  verifyOtpAction,
  signOutAction,
  googleSignInAction,
} from "@/app/_libs/auth-actions";
import SpinnerMini from "./SpinnerMini";
import Logo from "./Logo";
import Image from "next/image";

export default function AuthAction() {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  // Show loading state
  if (status === "loading") {
    return <SpinnerMini />;
  }

  // If user is authenticated, show user profile dropdown
  if (status === "authenticated" && session?.user) {
    return <div>User</div>;
  }

  // Show login dialog for unauthenticated users
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="icons-hover-600 border-1 flex text-sm px-3 py-0 rounded border-gray-500"
          >
            {t("Login.title") || "Login"}
          </Button>
        </DialogTrigger>

        <DialogContent
          className={cn(
            "bg-gradient-to-b from-primary-100 to-white pt-4",
            "max-w-none w-full h-full rounded-none border-0 md:h-11/12 md:rounded",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
          )}
        >
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              <div className="w-20">
                <Logo />
              </div>
            </DialogTitle>
            <DialogDescription>
              <EmailInput parentSetOpen={setOpen} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// User Profile Dropdown Component

function EmailInput({ parentSetOpen }) {
  const [email, setEmail] = useState({ email: "", error: "" });
  const [otpOpen, setOtpOpen] = useState(false);

  function handleEmailChange(e) {
    setEmail({ ...email, email: e.target.value, error: "" });
  }

  return (
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

function GoogleButton() {
  const [isPending, startTransition] = useTransition();

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      await googleSignInAction();
    });
  };

  return (
    <Button
      className="w-full mt-3 py-6 border-1 bg-white hover:bg-gray-50 font-bold text-gray-950 flex items-center justify-center gap-2"
      onClick={handleGoogleSignIn}
      disabled={isPending}
    >
      {isPending ? (
        <SpinnerMini />
      ) : (
        <>
          <Image src="/icons/google.jpg" alt="Google" width={20} height={20} />
          Continue with Google
        </>
      )}
    </Button>
  );
}

function ErrorMessage({ error }) {
  return (
    <span className="text-red-500 text-xs mt-2 flex items-center gap-1">
      <ExclamationCircleIcon className="w-4" />
      {error}
    </span>
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
  const router = useRouter();
  const OTPLENGTH = 6;

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Send OTP
  const handleSendOTP = () => {
    if (!email.email) {
      setEmail({ ...email, error: "Please enter an email address" });
      return;
    }
    if (!validateEmail(email.email)) {
      setEmail({ ...email, error: "Please enter a valid email address" });
      return;
    }

    startTransition(async () => {
      const result = await sendOtpAction(email.email);

      if (result.success) {
        setOtpOpen(true);
        setEmail({ ...email, error: "" });
      } else {
        setEmail({ ...email, error: result.error });
      }
    });
  };

  // Verify OTP and sign in
  const handleVerifyOTP = () => {
    if (!otp.OTP || otp.OTP.length < OTPLENGTH) {
      setOtp({ ...otp, error: "Please enter a complete OTP" });
      return;
    }

    startTransition(async () => {
      const result = await verifyOtpAction(email.email, otp.OTP);

      if (result.success) {
        // Success: close dialogs and refresh
        setOtpOpen(false);
        parentSetOpen(false);
        setOtp({ OTP: "", error: "" });
        setEmail({ email: "", error: "" });
        router.refresh();
      } else {
        setOtp({ ...otp, error: result.error });
      }
    });
  };

  return (
    <>
      <Button
        className="w-full bg-accent-400 hover:bg-accent-300 mt-3 py-6 rounded font-bold text-md text-white flex justify-center cursor-pointer"
        onClick={handleSendOTP}
        disabled={isPending}
      >
        {isPending ? <SpinnerMini /> : "Continue"}
      </Button>

      {/* OTP Verification Dialog */}
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
              <div className="flex justify-center flex-col items-center gap-2">
                <InputOTP
                  maxLength={OTPLENGTH}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp.OTP}
                  onChange={(value) => setOtp({ OTP: value, error: "" })}
                >
                  <InputOTPGroup className="flex justify-center">
                    {Array.from({ length: OTPLENGTH }).map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className={`border flex-1 ${
                          otp.error ? "border-red-500" : "border-gray-700"
                        }`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {otp.error && <ErrorMessage error={otp.error} />}
                <Button
                  className="w-1/2 mt-4"
                  onClick={handleVerifyOTP}
                  disabled={isPending}
                >
                  {isPending ? <SpinnerMini /> : "Submit"}
                </Button>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
