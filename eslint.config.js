// @ts-check

import eslint from '@eslint/js'
import tsEslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import reactPlugin from 'eslint-plugin-react'

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintPluginPrettierRecommended,
  reactPlugin.configs.flat.recommended,
  {
    rules: {
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      // indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'react/prop-types': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
)
