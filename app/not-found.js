import Image from "next/image";
import "./[locale]/globals.css";
import Link from "next/link";
export default function NotFound({ ...props }) {
    return (
        <div className="h-screen flex items-center justify-center flex-col">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
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
            />
        </div>
    );
}
