// app/flights/booking/page.js
import BookingPage from "@/app/_components/bookingPage/BookingPage";
import Navbar from "@/app/_components/Navbar";
import { auth } from "@/app/_libs/auth";

async function getCart(sessionId) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/flight/get-cart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
        cache: "no-store",
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch cart");
    }

    const data = await res.json();
    return data.data;
}

export default async function Page({ searchParams }) {
    const { session_id: sessionId } = searchParams;
    const session = await auth();

    let cart = null;
    let error = null;

    if (!sessionId) {
        error = "No session ID provided";
    } else {
        try {
            cart = await getCart(sessionId);
        } catch (err) {
            error = err.message;
        }
    }

    return (
        <>
            <div className="hidden sm:block">
                <Navbar />
            </div>
            {error ? (
                <div className="p-4 text-red-600">Error: {error}</div>
            ) : (
                <BookingPage isLogged={!!session?.user} cart={cart} />
            )}
        </>
    );
}
