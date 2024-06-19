/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    GITHUB_OAUTH_TOKEN: process.env.GITHUB_OAUTH_TOKEN,
  },
};

export default nextConfig;
