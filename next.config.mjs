/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["nunjucks", "pdf-parse", "mammoth", "tesseract.js"],
    serverActions: { bodySizeLimit: "16mb" },
  },
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({ "pdf-parse": "commonjs pdf-parse" });
    return config;
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};
export default nextConfig;
