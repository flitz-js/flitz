module.exports = {
  extends: "ego",
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
    "@typescript-eslint/indent": ["error", 2],
  },
};
