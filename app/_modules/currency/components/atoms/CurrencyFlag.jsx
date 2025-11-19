import Image from "next/image";

export default function CurrencyFlag({ src, alt }) {
    return (
        <Image src={src} alt={alt} width={20} height={20} className="size-5" />
    );
}
