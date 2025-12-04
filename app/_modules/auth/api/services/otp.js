const API_BASE_URL = process.env.API_BASE_URL || "https://api.travelsprovider.com";

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
