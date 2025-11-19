import Image from "next/image";

export default function SliderImage({ src, alt }) {
    return (
        <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80vw, (max-width: 1200px) 350px, 480px"
        />
    );
}
