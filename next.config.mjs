import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "github.com",
      "images.kiwi.com", // أضفت الموقع هنا
    ],
  },
};

export default withNextIntl(nextConfig);
