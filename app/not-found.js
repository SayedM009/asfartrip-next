"use client";
import Image from "next/image";
import "./[locale]/globals.css";
import Link from "next/link";
import FuzzyText from "@/components/FuzzyText";
import ElectricBorder from "@/components/ElectricBorder";
export default function NotFound({ ...props }) {
    return (
        <div className="h-screen flex items-center justify-center flex-col bg-gray-900">
            <FuzzyText
                baseIntensity={0.1}
                fontSize="clamp(5rem, 12vw, 8rem)"
                color="white"
            >
                404
            </FuzzyText>
            <FuzzyText
                baseIntensity={0.1}
                fontSize="clamp(2rem, 6vw, 4rem)"
                color="#ffffff"
            >
                Not Found
            </FuzzyText>

            <ElectricBorder
                color="#7df9ff"
                speed={1}
                chaos={0.5}
                thickness={4}
                style={{ borderRadius: 16, marginTop: "2rem" }}
            >
                <div className="px-8 py-4 ">
                    <Link
                        href="/"
                        className="text-white mt-6 font-bold uppercase"
                    >
                        Go Home
                    </Link>
                </div>
            </ElectricBorder>
            {/* <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="text-gray-500 mt-2">
                Sorry, we couldnt find this page.
            </p>
            <Link
                href="/"
                className="bg-black text-gray-50 px-5 py-3 my-5 uppercase font-semibold rounded hover:bg-black/80 transition-colors"
            >
                Go Home
            </Link>
            <Image
                src="/error.gif"
                alt="Not-found: 404"
                width={300}
                height={200}
            /> */}
        </div>
    );
}
