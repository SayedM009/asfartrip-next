import Image from "next/image";

export default function LanguageFlag({ flag, alt }) {
    return (
        <Image
            src={flag}
            alt={alt}
            width={25}
            height={25}
            loading="lazy"
            className="size-5"
        />
    );
}
