import { supabase } from "./supbase";

// Send OTP from Supabase
export async function sendOtp(email) {
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
        },
    });
    if (error) return { error, errorStatus: true };
    else return data;
}

// Verfiy OTP from Supabase
export async function verifyOtp(email, otp) {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
    });
    if (error) return { error, errorStatus: true };
}
