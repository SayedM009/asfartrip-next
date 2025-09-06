import {
  Open_Sans,
  Cairo,
  IBM_Plex_Sans_Arabic,
  IBM_Plex_Sans,
} from "next/font/google";
export const openSans = Open_Sans({
  subsets: ["latin"],
});

export const cairo = Cairo({
  subsets: ["latin"],
});

export const ibm = IBM_Plex_Sans_Arabic({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ibmSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
