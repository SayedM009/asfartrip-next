import { supabase } from "@/app/_libs/supbase";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("Sending OTP to:", email);

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: {
          // You can add custom user metadata here
          display_name: email.split("@")[0],
        },
      },
    });

    if (error) {
      console.error("Supabase OTP send error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("✅ OTP sent successfully");

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
