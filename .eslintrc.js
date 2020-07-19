module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "unicorn",
    "eslint-plugin-import",
    "no-null",
    "eslint-plugin-jsdoc",
  ],
  rules: {
    "comma-dangle": ["error", "never"],
    "quote-props": ["error", "as-needed", {
      "numbers": true
    }],
    "@typescript-eslint/indent": ["error", 2],
  },
};
