import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Lock workspace to this repo (avoids wrong root if a lockfile exists above the project).
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
