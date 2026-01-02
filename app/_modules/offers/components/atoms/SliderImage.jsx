import Image from "next/image";

export default function SliderImage({ src, alt, index }) {
    return (
        <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            priority={index < 2}
            fetchPriority={index < 2 ? "high" : "auto"}
            loading={index < 2 ? "eager" : "lazy"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
    );
}
