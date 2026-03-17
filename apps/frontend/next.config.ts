import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const isStaticExport = process.env.NEXT_OUTPUT_MODE === 'export';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: isStaticExport,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: isStaticExport ? 'export' : 'standalone',
  transpilePackages: ['motion'],
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
