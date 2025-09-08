"use client";

import { useState, useTransition } from "react";
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
import { sendOtp, verifyOtp } from "../_libs/api-services";
import SpinnerMini from "./SpinnerMini";
import Logo from "./Logo";
import Image from "next/image";

export default function AuthAction() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="icons-hover-600 border-1 flex text-sm px-3 py-0 rounded border-gray-500"
          >
            {t("Login.title")}
          </Button>
        </DialogTrigger>

        <DialogContent
          className={cn(
            "bg-gradient-to-b from-primary-100 to-white pt-4",
            "max-w-none w-full h-full rounded-none border-0  md:h-11/12 md:rounded",
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

function EmailInput({ parentSetOpen }) {
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
        <span className="capitalize text-xs text-gray-500">
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
  return (
    <Button className="w-full mt-3 py-6 border-1 bg-white font-bold text-gray-950 flex items-center justify-center gap-2">
      <Image src="/icons/google.jpg" alt="Google" width={20} height={20} />
      Continue with Google
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
  const OTPLENGTH = 6;

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async function handleSendOTP() {
    if (validateEmail(email.email)) {
      const action = await sendOtp(email.email);
      if (!action.errorStatus) {
        setOtpOpen(true);
      } else {
        console.error(action.error);
      }
    }
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

// "use client";

// import { useState, useTransition } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
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
// import {
//   sendOtpAction,
//   verifyOtpAction,
//   signOutAction,
//   googleSignInAction,
// } from "@/app/_libs/auth-actions";
// import SpinnerMini from "./SpinnerMini";
// import Logo from "./Logo";
// import Image from "next/image";

// export default function AuthAction() {
//   const t = useTranslations();
//   const { data: session, status } = useSession();
//   const [open, setOpen] = useState(false);

//   // Show loading state
//   if (status === "loading") {
//     return <SpinnerMini />;
//   }

//   // If user is authenticated, show user profile dropdown
//   if (status === "authenticated" && session?.user) {
//     return <div>User</div>;
//   }

//   // Show login dialog for unauthenticated users
//   return (
//     <div>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button
//             variant="outline"
//             className="icons-hover-600 border-1 flex text-sm px-3 py-0 rounded border-gray-500"
//           >
//             {t("Login.title") || "Login"}
//           </Button>
//         </DialogTrigger>

//         <DialogContent
//           className={cn(
//             "bg-gradient-to-b from-primary-100 to-white pt-4",
//             "max-w-none w-full h-full rounded-none border-0 md:h-11/12 md:rounded",
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

// // User Profile Dropdown Component

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
//   const [isPending, startTransition] = useTransition();

//   const handleGoogleSignIn = () => {
//     startTransition(async () => {
//       await googleSignInAction();
//     });
//   };

//   return (
//     <Button
//       className="w-full mt-3 py-6 border-1 bg-white hover:bg-gray-50 font-bold text-gray-950 flex items-center justify-center gap-2"
//       onClick={handleGoogleSignIn}
//       disabled={isPending}
//     >
//       {isPending ? (
//         <SpinnerMini />
//       ) : (
//         <>
//           <Image src="/icons/google.jpg" alt="Google" width={20} height={20} />
//           Continue with Google
//         </>
//       )}
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
//   const router = useRouter();
//   const OTPLENGTH = 6;

//   function validateEmail(email) {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   }

//   // Send OTP
//   const handleSendOTP = () => {
//     if (!email.email) {
//       setEmail({ ...email, error: "Please enter an email address" });
//       return;
//     }
//     if (!validateEmail(email.email)) {
//       setEmail({ ...email, error: "Please enter a valid email address" });
//       return;
//     }

//     startTransition(async () => {
//       const result = await sendOtpAction(email.email);

//       if (result.success) {
//         setOtpOpen(true);
//         setEmail({ ...email, error: "" });
//       } else {
//         setEmail({ ...email, error: result.error });
//       }
//     });
//   };

//   // Verify OTP and sign in
//   const handleVerifyOTP = () => {
//     if (!otp.OTP || otp.OTP.length < OTPLENGTH) {
//       setOtp({ ...otp, error: "Please enter a complete OTP" });
//       return;
//     }

//     startTransition(async () => {
//       const result = await verifyOtpAction(email.email, otp.OTP);

//       if (result.success) {
//         // Success: close dialogs and refresh
//         setOtpOpen(false);
//         parentSetOpen(false);
//         setOtp({ OTP: "", error: "" });
//         setEmail({ email: "", error: "" });
//         router.refresh();
//       } else {
//         setOtp({ ...otp, error: result.error });
//       }
//     });
//   };

//   return (
//     <>
//       <Button
//         className="w-full bg-accent-400 hover:bg-accent-300 mt-3 py-6 rounded font-bold text-md text-white flex justify-center cursor-pointer"
//         onClick={handleSendOTP}
//         disabled={isPending}
//       >
//         {isPending ? <SpinnerMini /> : "Continue"}
//       </Button>

//       {/* OTP Verification Dialog */}
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
//               <div className="flex justify-center flex-col items-center gap-2">
//                 <InputOTP
//                   maxLength={OTPLENGTH}
//                   pattern={REGEXP_ONLY_DIGITS}
//                   value={otp.OTP}
//                   onChange={(value) => setOtp({ OTP: value, error: "" })}
//                 >
//                   <InputOTPGroup className="flex justify-center">
//                     {Array.from({ length: OTPLENGTH }).map((_, i) => (
//                       <InputOTPSlot
//                         key={i}
//                         index={i}
//                         className={`border flex-1 ${
//                           otp.error ? "border-red-500" : "border-gray-700"
//                         }`}
//                       />
//                     ))}
//                   </InputOTPGroup>
//                 </InputOTP>
//                 {otp.error && <ErrorMessage error={otp.error} />}
//                 <Button
//                   className="w-1/2 mt-4"
//                   onClick={handleVerifyOTP}
//                   disabled={isPending}
//                 >
//                   {isPending ? <SpinnerMini /> : "Submit"}
//                 </Button>
//               </div>
//             </DialogDescription>
//           </DialogContent>
//         </Dialog>
//       )}
//     </>
//   );
// }

function FireIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={props.width || 100}
      height={props.height || 100}
      x="0"
      y="0"
      viewBox="0 0 511.999 511.999"
      style={{ enableBackground: "new 0 0 512 512" }}
      {...props}
    >
      <g>
        <path
          d="M363.429 406.115a96.45 96.45 0 0 1-.27 7.781c-4.007 53.795-52.079 94.466-106.72 88.314l-126.608-14.276c-57.226-6.446-96.022-61.38-82.935-117.466L83.475 213.74l2.218-9.485c6.102-26.174 19.239-49.053 37.044-66.956a137.066 137.066 0 0 0-.527 12.107c0 8.271.735 16.653 2.255 25.047l30.353 167.953c10.244 56.675 67.642 91.709 122.736 74.921l85.802-26.15.073 14.938z"
          fill="#f95428"
        />
        <path
          d="M122.741 137.3a137.066 137.066 0 0 0-.527 12.107c0 8.271.735 16.653 2.255 25.047l30.353 167.953c10.244 56.675 67.642 91.709 122.736 74.921l85.802-26.15 36.076-11.004c55.094-16.788 83.192-77.886 60.081-130.639L391.029 93.21C362.478 28.043 289.677-5.434 221.618 15.312c-55.878 17.02-94.024 66.196-98.877 121.988zm86.636-40.867c-4.252-18.038 6.188-36.529 24.177-41.994 18.724-5.71 38.539 4.84 44.237 23.564 2.965 9.742 1.544 19.766-3.149 27.951a35.273 35.273 0 0 1-20.415 16.298c-18.736 5.71-38.539-4.84-44.249-23.577a29.524 29.524 0 0 1-.601-2.242z"
          fill="#f7b239"
        />
        <path
          d="m363.355 391.177-85.802 26.15c-55.094 16.788-112.491-18.246-122.736-74.921l-30.353-167.953a140.642 140.642 0 0 1-2.255-25.047c0-4.068.172-8.1.527-12.107-17.805 17.903-30.941 40.781-37.044 66.956l-2.218 9.485 29.679 164.203c10.244 56.675 67.642 91.709 122.736 74.921l85.802-26.15 36.076-11.004a95.251 95.251 0 0 0 5.392-1.814 96.45 96.45 0 0 0 .27-7.781l-.074-14.938z"
          fill="#e54728"
        />
        <path
          d="M222.182 95.845c-4.313 0-8.578.184-12.805.588.172.747.368 1.495.6 2.242 5.71 18.736 25.513 29.287 44.249 23.577a35.273 35.273 0 0 0 20.415-16.298c-11.494-4.62-23.785-7.769-36.627-9.227a141.054 141.054 0 0 0-15.832-.882z"
          fill="#f95428"
        />
        <path
          d="M430.965 324.734a9.156 9.156 0 0 1-3.834-.843c-4.611-2.121-6.631-7.579-4.509-12.19 6.821-14.83 6.969-31.232.418-46.184l-68.486-156.324c-5.503-12.562-13.362-23.676-23.356-33.034a9.19 9.19 0 0 1-.426-12.99c3.47-3.704 9.286-3.897 12.99-.426 11.824 11.071 21.12 24.219 27.628 39.075l68.486 156.324c8.687 19.827 8.49 41.576-.554 61.242a9.198 9.198 0 0 1-8.357 5.35z"
          fill="#ffffff"
        />
        <circle cx="315.981" cy="53.74" r="9.19" fill="#ffffff" />
        <path
          d="M283.294 109.336c5.607-10.524 6.78-22.601 3.304-34.006-7.177-23.545-32.173-36.861-55.716-29.686-11.406 3.476-20.775 11.187-26.383 21.71-5.607 10.524-6.78 22.601-3.304 34.007 5.86 19.224 23.597 31.63 42.726 31.63 4.3 0 8.67-.626 12.99-1.943 11.406-3.478 20.775-11.188 26.383-21.712zm-59.682-4.294a132.07 132.07 0 0 1 34.952 5.097 26.342 26.342 0 0 1-7.012 3.323c-6.71 2.046-13.814 1.355-20.005-1.943a26.194 26.194 0 0 1-7.935-6.477zm45.846-10.76A149.876 149.876 0 0 0 239.05 87.6c-7.029-.799-14.269-1.08-21.349-.87a26.166 26.166 0 0 1 3.019-10.733c3.298-6.191 8.809-10.726 15.52-12.771a26.204 26.204 0 0 1 7.642-1.143c11.254 0 21.686 7.297 25.133 18.606a26.06 26.06 0 0 1 .443 13.593z"
          fill="#333333"
        />
        <path
          d="M54.494 453.104a105.502 105.502 0 0 0 74.324 43.962l126.609 14.271c3.931.442 7.863.662 11.779.662 25.856 0 51.016-9.53 70.447-26.98a105.509 105.509 0 0 0 34.983-78.945l-.039-8.106 29.528-9.001a105.491 105.491 0 0 0 65.034-56.789 105.5 105.5 0 0 0 .782-86.337L399.454 89.517C369.045 20.103 291.45-15.578 218.956 6.516c-58.421 17.806-98.654 68.612-105.02 126.697-18.28 19.222-31.119 42.982-37.18 68.951L37.962 368.376a105.47 105.47 0 0 0 16.532 84.728zm342.274-81.717L274.89 408.535a87.105 87.105 0 0 1-70.716-8.965 87.104 87.104 0 0 1-40.295-58.803l-30.351-167.95c-11.82-65.406 27.211-129.339 90.787-148.718a130.97 130.97 0 0 1 38.219-5.715c50.865 0 98.734 29.775 120.085 78.51l68.489 156.327a87.094 87.094 0 0 1-.645 71.28 87.103 87.103 0 0 1-53.695 46.886zM55.86 372.554l38.794-166.213a131.082 131.082 0 0 1 18.996-43.535c.398 4.414.988 8.842 1.789 13.277l30.351 167.95a105.502 105.502 0 0 0 48.805 71.224 105.498 105.498 0 0 0 85.653 10.86l73.994-22.553.012 2.6a87.11 87.11 0 0 1-28.883 65.18 87.106 87.106 0 0 1-67.886 21.729l-126.609-14.271a87.114 87.114 0 0 1-61.367-36.299 87.09 87.09 0 0 1-13.649-69.949z"
          fill="#333333"
        />
        <path
          d="m350.443 201.291-121.878 37.148a9.193 9.193 0 0 1-2.682.402 9.19 9.19 0 0 1-2.677-17.984l121.878-37.148a9.191 9.191 0 0 1 5.359 17.582zM238.828 280.577a9.19 9.19 0 0 1-2.677-17.984l121.878-37.148c4.854-1.482 9.991 1.257 11.471 6.112a9.19 9.19 0 0 1-6.112 11.471L241.51 280.176a9.191 9.191 0 0 1-2.682.401z"
          fill="#333333"
        />
      </g>
    </svg>
  );
}
