import { Link } from "@/i18n/navigation";
import Image from "next/image";

function Logo() {
  return (
    <Link href="/">
      <Image src="/lightLogo.webp" width={100} height={50} alt="logo"></Image>
    </Link>
  );
}

export default Logo;
