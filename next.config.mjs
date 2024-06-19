/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    GITHUB_OAUTH_TOKEN: process.env.GITHUB_OAUTH_TOKEN,
    NEXT_AWS_ACCESS_KEY_ID: process.env.NEXT_AWS_ACCESS_KEY_ID,
    NEXT_AWS_SECRET_ACCESS_KEY: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
  },
};

export default nextConfig;
