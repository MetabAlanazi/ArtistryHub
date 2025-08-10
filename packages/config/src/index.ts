// Export configuration presets
export { default as eslintConfig } from './eslint-config';
export { default as prettierConfig } from './prettier-config';
export { default as tsconfigBase } from './tsconfig/base.json';
export { default as tailwindBase } from './tailwind/base.js';

// Re-export individual configs for direct import
export * from './eslint-config';
export * from './prettier-config';
export * from './tsconfig/base.json';
export * from './tailwind/base.js';

