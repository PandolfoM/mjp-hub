/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose",
  },
  env: {
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    GITHUB_OAUTH_TOKEN: process.env.GITHUB_OAUTH_TOKEN,
    NEXT_AWS_ACCESS_KEY_ID: process.env.NEXT_AWS_ACCESS_KEY_ID,
    NEXT_AWS_SECRET_ACCESS_KEY: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
};

export default nextConfig;
