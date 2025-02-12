import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login', // Cambia esto por la página que quieres como principal
        permanent: true, // true indica una redirección 301 (permanente)
      },
    ];
  },
};

export default nextConfig;