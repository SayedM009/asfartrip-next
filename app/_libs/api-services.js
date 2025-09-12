import { supabase } from "./supbase";
const API = process.env.NEXT_PUBLIC_APP_API_BASE_URL;
// Search airports
export async function searchAirports(value) {
    if (!value) throw new Error("There is no value");
    try {
        const res = await fetch(`${API}/api/flight/airports?term=${value}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error.message);
    }
}

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

export async function verifyOtp(email, otp) {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
    });
    if (error) return { error, errorStatus: true };
}
