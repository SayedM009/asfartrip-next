import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import GoogleIcon from "../SVG/GoogleIcon";
import SpinnerMini from "../SpinnerMini";

export default function GoogleButton() {
  const [isPending, startTransition] = useTransition();
  function handleSignInWithGoogle() {
    startTransition(() => signIn("google"));
  }
  return (
    <Button
      className="w-full mt-3 py-6 border-1 bg-white font-bold text-gray-950 flex items-center justify-center gap-2 hover:bg-white/90"
      onClick={handleSignInWithGoogle}
      disabled={isPending}
    >
      {isPending ? (
        <SpinnerMini />
      ) : (
        <>
          <GoogleIcon /> Continue with Google
        </>
      )}
    </Button>
  );
}
