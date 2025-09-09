import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://lh3.googleusercontent.com/a/**")],
    domains: ["lh3.googleusercontent.com"],
  },
};

export default withNextIntl(nextConfig);
