import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // https://k1x7g17p-3000.euw.devtunnels.ms/
  // allowedHosts: ["k1x7g17p-3000.euw.devtunnels.ms"],
  allowedDevOrigins: ["http://localhost:3000", "https://k1x7g17p-3000.euw.devtunnels.ms"],
  /* config options here */
};

export default nextConfig;
