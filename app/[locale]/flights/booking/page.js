// app/flights/booking/page.js
import BookingPage from "@/app/_components/bookingPage/BookingPage";
import Navbar from "@/app/_components/Navbar";
import { auth } from "@/app/_libs/auth";

export default async function Page() {
    const session = await auth();
    return (
        <>
            <div className="hidden sm:block">
                <Navbar />
            </div>
            <BookingPage isLogged={!!session?.user} />
        </>
    );
}
