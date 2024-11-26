/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "snapcstorage.blob.core.windows.net",
        port: "", // Leave empty if no port is required
        pathname: "/**", // Allow all paths under this hostname
      },
    ],
  },
};

export default nextConfig;
