const js = require("@eslint/js");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
    ],
  },

  {
    files: [
      "eslint.config.js",
      "src/**/*.js",
      "tests/**/*.js",
    ],

    ...js.configs.recommended,

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",

      globals: {
        console: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },

    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

  {
    files: [
      "src/client/**/*.js",
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",

      globals: {
        alert: "readonly",
        document: "readonly",
        io: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },

    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];