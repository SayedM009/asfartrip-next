import Footer from "@/app/_components/footer/Footer"
import Navbar from "@/app/_components/navigation/Navbar"
import { auth } from "@/app/_libs/auth"
import ShadcnAvatar from "@/app/_modules/auth/components/molecules/ShadcnAvatar"
import { getTranslations } from "next-intl/server"
import ProfileNavLinks from "@/app/_modules/profile/components/molecules/ProfileNavLinks"

async function layout({ children }) {
    return <section className="container-custom">
        <div className="hidden md:block">
            <Navbar />
        </div>
        <div className="grid grid-cols-4 gap-4 md:min-h-screen md:pt-10">
            <div className="col-span-1 hidden md:block"><PagesNavigation /></div>
            <div className="col-span-4 md:col-span-3"> {children}</div>
        </div>

        <div className="hidden md:block">
            <Footer />
        </div>
    </section >
}

async function PagesNavigation() {
    const p = await getTranslations("Profile")
    const translations = {
        dashboard: p("dashboard"),
        personal_info: p("personal_info"),
        travellers: p("travellers"),
        my_bookings: p("my_bookings"),
        hotels: p("hotels"),
        flights: p("flights"),
        insurance: p("insurance"),
        contact_support: p("contact_support"),
    }
    return <div>
        <Profile />
        <ProfileNavLinks translations={translations} />
    </div>
}

async function Profile() {
    const session = await auth()
    return <div className="flex items-center gap-2 ">
        <ShadcnAvatar user={session.user} className="w-16 h-16" />
        <div>
            <h1 className="capitalize font-bold text-lg">{session.user.name.toLocaleLowerCase()}</h1>
            <p className="text-sm text-gray-500">{session.user.email}</p>
        </div>
    </div>
}

export default layout
