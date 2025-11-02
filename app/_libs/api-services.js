// api-services.js
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://uat-api.travelsprovider.com";

// Send OTP
export async function sendOtp(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/b2c/sendotp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok || !data.status) {
            return {
                error: data.message || "Failed to send OTP",
                errorStatus: true,
            };
        }

        return {
            data,
            errorStatus: false,
        };
    } catch (error) {
        return {
            error: error.message || "Network error",
            errorStatus: true,
        };
    }
}

// Verify OTP and Login
export async function verifyOtp(email, otp) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/b2c/login-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                otp,
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.status) {
            return {
                error: data.message || "Invalid OTP",
                errorStatus: true,
            };
        }

        return {
            data,
            errorStatus: false,
        };
    } catch (error) {
        return {
            error: error.message || "Network error",
            errorStatus: true,
        };
    }
}

// Resend OTP
export async function resendOtp(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/b2c/resend-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok || !data.status) {
            return {
                error: data.message || "Failed to resend OTP",
                errorStatus: true,
            };
        }

        return {
            data,
            errorStatus: false,
        };
    } catch (error) {
        return {
            error: error.message || "Network error",
            errorStatus: true,
        };
    }
}
// import { supabase } from "./supbase";

// // Send OTP from Supabase
// export async function sendOtp(email) {
//     const { data, error } = await supabase.auth.signInWithOtp({
//         email,
//         options: {
//             shouldCreateUser: true,
//         },
//     });
//     if (error) return { error, errorStatus: true };
//     else return data;
// }

// // Verfiy OTP from Supabase
// export async function verifyOtp(email, otp) {
//     const { data, error } = await supabase.auth.verifyOtp({
//         email,
//         token: otp,
//         type: "email",
//     });
//     if (error) return { error, errorStatus: true };
// }
