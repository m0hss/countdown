import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/*": [
      "./app/theme.css",
      "./node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf",
      "./node_modules/@fontsource/space-mono/files/space-mono-latin-400-normal.woff",
    ],
  },
};
export default config;
