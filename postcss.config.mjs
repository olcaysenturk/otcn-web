const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // Explicitly point to our Tailwind config so class-based dark mode works without @config directives
      config: "./tailwind.config.mjs",
    },
  },
};

export default config;
