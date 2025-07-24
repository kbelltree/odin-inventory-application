import eslintRecommended from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['node_modules/**', 'public/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...eslintRecommended.configs.recommended.rules,
      'prettier/prettier': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'off',
      'no-console': 'off',
    },
  },
];
