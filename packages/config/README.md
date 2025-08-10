# @artistry-hub/config

Shared configuration presets for the ArtistryHub platform.

## What it exports

This package provides standardized configuration files that can be extended by all apps and packages:

- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting rules
- **TypeScript**: Base TypeScript configuration
- **Tailwind CSS**: Base styling configuration

## How to consume

### 1. ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@artistry-hub/config/eslint-config'],
  // Add app-specific rules
  rules: {
    'no-console': 'warn'
  }
}
```

### 2. Prettier Configuration

```javascript
// .prettierrc.js
module.exports = {
  ...require('@artistry-hub/config/prettier-config')
}
```

### 3. TypeScript Configuration

```json
// tsconfig.json
{
  "extends": "@artistry-hub/config/tsconfig/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4. Tailwind CSS Configuration

```javascript
// tailwind.config.js
const baseConfig = require('@artistry-hub/config/tailwind/base.js')

module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Add app-specific content paths
  ],
  // Extend or override as needed
  theme: {
    extend: {
      colors: {
        // App-specific colors
      }
    }
  }
}
```

## Configuration Details

### ESLint Config

The ESLint configuration includes:
- Next.js core web vitals
- TypeScript recommended rules
- React hooks rules
- Import ordering and organization
- Consistent code style enforcement

### Prettier Config

The Prettier configuration ensures:
- Consistent code formatting
- Proper line length limits
- Consistent quote and semicolon usage
- Trailing comma handling

### TypeScript Config

The base TypeScript configuration provides:
- ES2020 target
- Strict type checking
- Next.js plugin support
- Path alias support (@/*)
- DOM and ES6 library support

### Tailwind Config

The base Tailwind configuration includes:
- Consistent color palette
- Standardized spacing scale
- Typography system
- Component-specific utilities

## Versioning & Internal Dependency Rules

- **Version**: Follows semantic versioning
- **Breaking Changes**: Major version bumps for config changes
- **Internal Dependencies**: All apps should use compatible versions
- **Updates**: Config changes should be backward compatible

## Development

```bash
# From root directory
yarn workspace @artistry-hub/config dev
yarn workspace @artistry-hub/config build
yarn workspace @artistry-hub/config test
```

## Customization

### Extending Configurations

```javascript
// ESLint: Add app-specific rules
module.exports = {
  extends: ['@artistry-hub/config/eslint-config'],
  rules: {
    'app-specific-rule': 'error'
  }
}

// Tailwind: Add app-specific theme
module.exports = {
  ...baseConfig,
  theme: {
    extend: {
      colors: {
        'app-primary': '#your-color'
      }
    }
  }
}
```

### Overriding Configurations

```javascript
// Completely override if needed
module.exports = {
  // Custom config that doesn't extend base
  rules: {
    // Your rules
  }
}
```

## Best Practices

1. **Extend, don't override** - Use the base configs as a foundation
2. **Consistent styling** - Maintain design system consistency across apps
3. **Type safety** - Use strict TypeScript configurations
4. **Code quality** - Enforce consistent code style and quality
5. **Performance** - Optimize Tailwind CSS builds for each app

## Troubleshooting

1. **ESLint errors**: Check that the config package is properly installed
2. **TypeScript issues**: Verify tsconfig extends the correct base config
3. **Tailwind problems**: Ensure content paths include all relevant files
4. **Build failures**: Check that all config dependencies are available

## Migration

When updating configurations:

1. **Test locally** - Verify configs work in development
2. **Update gradually** - Update one config at a time
3. **Check compatibility** - Ensure all apps work with new configs
4. **Document changes** - Update app-specific documentation

## Integration Examples

### Next.js App

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js specific config
}

module.exports = nextConfig
```

### React Component

```typescript
// Component with proper TypeScript and ESLint
import React from 'react'
import { Button } from '@artistry-hub/ui'

interface Props {
  children: React.ReactNode
  onClick?: () => void
}

export const MyButton: React.FC<Props> = ({ children, onClick }) => (
  <Button onClick={onClick}>{children}</Button>
)
```

### Tailwind Component

```typescript
// Component using shared Tailwind config
export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    {children}
  </div>
)
```
