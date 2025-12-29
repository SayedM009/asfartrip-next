import Footer from "@/app/_components/footer/Footer"
import Navbar from "@/app/_components/navigation/Navbar"
import { auth } from "@/app/_libs/auth"
import ShadcnAvatar from "@/app/_modules/auth/components/molecules/ShadcnAvatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Link } from "@/i18n/navigation"
import { Squares2X2Icon, UserGroupIcon } from "@heroicons/react/24/outline"
import { BedDouble, CalendarRange, Mail, Plane, Shield, UserIcon } from "lucide-react"

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
    return <div>
        <Profile />
        <Links />
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


function Links() {

    const style = "flex items-center gap-5 text-xl hover:bg-gray-100 dark:hover:bg-gray-800 p-2"

    return <div className="flex flex-col gap-5 mt-10">
        <Link href="/profile/dashboard" className={style}><Squares2X2Icon className="size-6 text-black dark:text-white" /> Dashboard</Link>
        <Link href="/profile/profile-info" className={style}><UserIcon className="size-6 text-black dark:text-white" /> Profile Info</Link>
        <Link href="/profile/travellers" className={style}><UserGroupIcon className="size-6 text-black dark:text-white" /> Travellers</Link>
        <Accordion
            type="single"
            collapsible
            className="w-full "
        >
            <AccordionItem value="item-1" className="p-0 ">
                <AccordionTrigger className="p-0 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-5">
                    <div className={style} ><CalendarRange className="size-6 text-black dark:text-white" /> My Bookings</div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance pl-6">
                    <Link href="/profile/hotels" className={style}><BedDouble className="size-6 text-black dark:text-white" /> Hotels</Link>
                    <Link href="/profile/flights" className={style}><Plane className="size-6 text-black dark:text-white" /> Flight</Link>
                    <Link href="/profile/insurance" className={style}><Shield className="size-6 text-black dark:text-white" /> Insurance</Link>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
        <Link href="/contact-us" className={style} target="_blank"><Mail className="size-6 text-black dark:text-white" /> Contact us</Link>
    </div>
}

export default layout
