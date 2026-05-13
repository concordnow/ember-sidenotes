import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import n from 'eslint-plugin-n';
import globals from 'globals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      'blueprints/*/files/**',
      'vendor/**',
      'dist/**',
      'tmp/**',
      'bower_components/**',
      'node_modules/**',
      'coverage/**',
      '.eslintcache',
      '.node_modules.ember-try/**',
      'bower.json.ember-try',
      'package.json.ember-try',
    ],
  },
  js.configs.recommended,
  ...compat.extends('plugin:ember/recommended'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
        },
      },
      globals: { ...globals.browser },
    },
  },
  // Node CommonJS config / build scripts
  {
    files: [
      '.prettierrc.js',
      '.template-lintrc.js',
      'ember-cli-build.js',
      'index.js',
      'testem.js',
      'blueprints/*/index.js',
      'config/**/*.js',
      'tests/dummy/config/**/*.js',
    ],
    ...n.configs['flat/recommended-script'],
    languageOptions: {
      ...n.configs['flat/recommended-script'].languageOptions,
      sourceType: 'script',
      globals: { ...globals.node },
    },
    rules: {
      ...n.configs['flat/recommended-script'].rules,
      // Build-time scripts legitimately import devDeps
      'n/no-unpublished-import': 'off',
      'n/no-unpublished-require': 'off',
    },
  },
  // eslint.config.mjs is ESM
  {
    files: ['eslint.config.mjs'],
    ...n.configs['flat/recommended-module'],
    languageOptions: {
      ...n.configs['flat/recommended-module'].languageOptions,
      globals: { ...globals.node },
    },
    rules: {
      ...n.configs['flat/recommended-module'].rules,
      'n/no-unpublished-import': 'off',
    },
  },
  {
    files: ['tests/**/*-test.{js,ts}'],
    ...compat.extends('plugin:qunit/recommended')[0],
  },
];
