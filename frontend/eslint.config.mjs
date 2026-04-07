import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    ignores: [
      "src/components/**",
    ],
  },
];

export default config;
