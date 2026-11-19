/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // `npm run build` writes a static site to ./out
  images: { unoptimized: true },
};
export default nextConfig;
