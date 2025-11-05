// app/flights/booking/page.js
import BookingPage from "@/app/_components/flightComponents/bookingPage/BookingPage";
import Navbar from "@/app/_components/Navbar";
import { auth } from "@/app/_libs/auth";
import { getCart } from "@/app/_libs/flightService";

export default async function Page({ searchParams }) {
    const { session_id: sessionId } = await searchParams;
    const session = await auth();

    let cart = null;
    let error = null;

    if (!sessionId) {
        error = "No session ID provided";
    } else {
        try {
            cart = await getCart(sessionId);
        } catch (err) {
            error = err.message + "test tes testset";
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
                <BookingPage
                    isLogged={!!session?.user}
                    cart={cart}
                    sessionId={sessionId}
                    userId={session?.user.id}
                />
            )}
        </>
    );
}
