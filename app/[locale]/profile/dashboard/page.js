import LoyaltyPoints, { LoyaltyTier } from "@/app/_components/profile/LoyaltyPoints"
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage"
import { BadgePercent } from "lucide-react"

function page() {

    return <section className="grid grid-cols-3 gap-4">
        <LoyaltyTier />
        <LoyaltyPoints />
        <Offers />
    </section>
}

function Offers() {
    return <div className="shadow-lg p-4  border  rounded-xl flex flex-col  hover:cursor-pointer user-select-none hover:shadow-xl transition-all col-span-1">
        <BadgePercent />
        <h2 className="font-bold text-xl mt-4">Offers</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2" >Get the best deals on hotels, flights, and more.</p>
    </div>

}

export default page
