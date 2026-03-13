// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    // --- GLOBAL IGNORES ---
    ignores: ['dist/**', '.angular/**', 'node_modules/**', 'coverage/**'],
  },
  {
    // --- TYPESCRIPT & ANGULAR LOGIC RULES ---
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylisticTypeChecked, // Audit seviyesi için Type-Checked kurallar
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // PRO: Strict Typing & Code Quality
      '@typescript-eslint/no-explicit-any': 'warn', // 'any' kullanımını denetle (Audit gereksinimi)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      
      // PRO: Angular Best Practices
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/no-conflicting-lifecycle': 'error',
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error', // Audit: Performans için OnPush şartı
      '@angular-eslint/use-lifecycle-interface': 'error',
    },
  },
  {
    // --- ANGULAR TEMPLATE RULES ---
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // PRO: Template Performance & Accessibility
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/no-any': 'error', // Template içinde 'any' kullanımını yasakla
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/cyclomatic-complexity': ['error', { maxComplexity: 6 }], // Audit: Çok karmaşık template'leri engelle
    },
  }
);
