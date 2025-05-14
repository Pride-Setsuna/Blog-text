module.exports = {
  i18n: {
    locales: ['en', 'zh', 'ja'],
    defaultLocale: 'zh',
    localeDetection: true
  },
  experimental: {
    outputStandalone: true,
  },
  transpilePackages: ['dayjs'],
  images: {
    domains: ['www.notion.so', 'images.unsplash.com', 's3.us-west-2.amazonaws.com']
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()'
          }
        ]
      }
    ]
  },
  async rewrites() {
    return []
  },
  output: 'standalone'
}
