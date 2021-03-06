/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    projects_per_page: +process.env.projects_per_page,
    api_url: process.env.api_url,
  },
};
