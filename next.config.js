/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Allow importing the Pyodide web worker with `new Worker(new URL(...))`
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };

    // Suppress internal Webpack filesystem cache snapshot warnings on Windows drives
    config.infrastructureLogging = {
      level: "error",
    };

    return config;
  },
};

module.exports = nextConfig;
