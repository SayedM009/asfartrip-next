import Image from "next/image";
import { useSession } from "next-auth/react";
function LoyaltyPointsBanner() {
    const { data: session, status } = useSession();
    if (status === "unauthenticated") return null;
    return (
        <div className="bg-gradient-to-l from-[#1fa86b] to-[#0a3c2a] text-white  p-5 sm:mb-5 rounded-lg relative flex justify-between">
            <p className="text-sm">
                لان عضويتك هاوى راح تكسب{" "}
                <span className="text-xl font-semibold">795</span> نقطة ولاء
            </p>
            {/* <Image src="/icons/coin.gif" alt="coins" width={50} height={50} /> */}
            <Image
                src="/icons/coin-B.png"
                alt="coins"
                width={25}
                height={25}
                className="absolute left-8 top-2"
            />
            <Image
                src="/icons/coin.png"
                alt="coins"
                width={30}
                height={30}
                className="absolute left-5 top-7"
            />
        </div>
    );
}

export default LoyaltyPointsBanner;
