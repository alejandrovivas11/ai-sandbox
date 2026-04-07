import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      "jest.config.ts",
      "jest.setup.ts",
      "src/components/blocks/**",
      "src/components/ui/**",
      "src/components/composed/**",
      "src/components/features/**",
    ],
  },
];

export default eslintConfig;
