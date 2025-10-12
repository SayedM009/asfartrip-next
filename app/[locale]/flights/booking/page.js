// app/flights/booking/page.js
import BookingPage from "@/app/_components/bookingPage/BookingPage";
import Navbar from "@/app/_components/Navbar";
import { auth } from "@/app/_libs/auth";

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const { temp_id } = params;

    if (!temp_id) {
        return <div>Missing ticket ID</div>;
    }

    console.log("📥 Fetching ticket with ID:", temp_id);

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/flight/temp-flights/${temp_id}`,
            {
                cache: "no-store",
            }
        );

        if (!res.ok) {
            const error = await res.json();
            console.error("❌ Fetch error:", error);
            return (
                <div className="p-8 text-center">
                    <h2 className="text-xl font-bold text-red-600">
                        {error.error || "Ticket expired or not found"}
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Please search for flights again
                    </p>
                </div>
            );
        }

        const data = await res.json();
        const { ticket, searchInfo } = data;

        const session = await auth();

        return (
            <>
                <div className="hidden sm:block">
                    <Navbar />
                </div>
                <BookingPage
                    bookingData={ticket}
                    searchParams={JSON.parse(searchInfo || {})}
                    isLogged={!!session?.user}
                />
            </>
        );
    } catch (error) {
        console.error("❌ Error loading booking page:", error);
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-red-600">
                    Error loading booking
                </h2>
                <p className="mt-2 text-gray-600">{error.message}</p>
            </div>
        );
    }
}
// import BookingPage from "@/app/_components/bookingPage/BookingPage";
// import Navbar from "@/app/_components/Navbar";
// import { auth } from "@/app/_libs/auth";
// import React from "react";

// export default async function Page({ searchParams }) {
//     const { temp_id } = await searchParams;

//     // Getting the Save Ticket in a Custome API
//     const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/flight/temp-flights/${temp_id}`,
//         {
//             cache: "no-store",
//         }
//     );
//     const data = await res.json();

//     if (!res.ok) {
//         return <div>Ticket expired or not found</div>;
//     }

//     const { ticket, searchInfo } = data;

//     // Check if the client is already signed in
//     const session = await auth();
//     console.log(data);
//     return (
//         <>
//             <div className="hidden sm:block ">
//                 <Navbar />
//             </div>
//             <BookingPage
//                 bookingData={ticket}
//                 searchParams={searchInfo}
//                 isLogged={!!session?.user}
//             />
//         </>
//     );
// }
