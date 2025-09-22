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

// Exchange currency
// دالة مستقلة للتحويل لأي قيمة خارج الـ hook
export async function convertCurrency(amount, toCurrency) {
    if (!amount) return 0;
    const res = await fetch(
        `https://api.exchangerate.host/convert?from=AED&to=${toCurrency}&amount=${amount}`
    );
    const data = await res.json();
    return data.result;
}
