/* eslint-disable @typescript-eslint/no-var-requires */

const withReactSvg = require("next-react-svg");
const path = require("path");

const nextReactSvgOptions = {
  include: path.resolve(__dirname, "public"),
};

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
module.exports = (phase, defaultConfig) => {
  const plugins = [withReactSvg(nextReactSvgOptions)];

  const config = plugins.reduce(
    (acc, plugin) => {
      const update = plugin(acc);
      return typeof update === "function"
        ? update(phase, defaultConfig)
        : update;
    },
    { ...nextConfig }
  );

  return config;
};
