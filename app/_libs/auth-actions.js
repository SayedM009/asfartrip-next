"use server";

import { signIn, signOut } from "@/app/[locale]/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

// Server action to send OTP
export async function sendOtpAction(email) {
  try {
    const response = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/api/auth/send-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to send OTP",
      };
    }

    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("Send OTP action error:", error);
    return {
      success: false,
      error: "Failed to send OTP",
    };
  }
}

// Server action to verify OTP and sign in
export async function verifyOtpAction(email, token) {
  try {
    await signIn("otp-email", {
      email,
      token,
      redirect: false,
    });

    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    console.error("Verify OTP action error:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "Invalid OTP code",
          };
        default:
          return {
            success: false,
            error: "Authentication failed",
          };
      }
    }

    return {
      success: false,
      error: "Verification failed",
    };
  }
}

// Server action to sign out
export async function signOutAction() {
  await signOut({
    redirect: false,
  });
  redirect("/");
}

// Server action for Google sign in
export async function googleSignInAction() {
  await signIn("google");
}
