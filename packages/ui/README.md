# @artistry-hub/ui

Shared generic UI components for the ArtistryHub platform.

## What it exports

This package provides reusable, brand-agnostic UI components that can be used across all apps:

- **Basic Components**: Button, Input, Card, Alert
- **Utility Functions**: CSS class merging utilities
- **Design System**: Consistent spacing, colors, and typography
- **Accessibility**: ARIA-compliant components

## Important: No Branding or Navigation

**This package does NOT include:**

- Navigation bars
- Footers
- Brand-specific styling
- App-specific layouts

Each app must implement its own unique navbar/branding to maintain independence.

## How to consume

### 1. Import Components

```typescript
import { Button, Input, Card, Alert } from '@artistry-hub/ui'

// Use components with consistent styling
<Button variant="primary">Click me</Button>
<Input placeholder="Enter text..." />
<Card>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

### 2. Import Utilities

```typescript
import { cn } from "@artistry-hub/ui";

// Merge CSS classes conditionally
const buttonClasses = cn(
  "base-button",
  isActive && "active",
  variant === "primary" && "primary-styles"
);
```

### 3. Extend with App-specific Styling

```typescript
// Each app can extend the base components
<Button className="app-specific-button" variant="primary">
  Custom Button
</Button>
```

## Available Components

### Button

- Multiple variants: primary, secondary, outline, ghost
- Size options: sm, md, lg
- Loading states and disabled states
- Full accessibility support

### Input

- Text, email, password, number types
- Error states and validation
- Icon support (prefix/suffix)
- Responsive design

### Card

- Flexible content containers
- Header, body, and footer sections
- Hover effects and shadows
- Responsive padding and margins

### Alert

- Success, warning, error, info variants
- Dismissible alerts
- Icon integration
- Accessible announcements

## Design System

The package provides a consistent design foundation:

- **Colors**: Semantic color palette
- **Spacing**: Consistent spacing scale
- **Typography**: Font families and sizes
- **Shadows**: Elevation system
- **Transitions**: Smooth animations

## Styling

Components use Tailwind CSS with a shared configuration:

```typescript
// Extend the base Tailwind config
import baseConfig from "@artistry-hub/config/tailwind";

export default {
  ...baseConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add app-specific content paths
  ],
  // Override or extend as needed
};
```

## Versioning & Internal Dependency Rules

- **Version**: Follows semantic versioning
- **Breaking Changes**: Major version bumps for component API changes
- **Internal Dependencies**: Apps can use any compatible version
- **Updates**: Components are backward compatible within major versions

## Development

```bash
# From root directory
yarn workspace @artistry-hub/ui dev
yarn workspace @artistry-hub/ui build
yarn workspace @artistry-hub/ui test
```

## Testing

The package includes comprehensive tests for:

- Component rendering
- Props validation
- Accessibility features
- Responsive behavior
- Theme integration

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG compliant color combinations
- **Screen Reader**: Optimized for assistive technologies

## Customization

### Theme Overrides

```typescript
// Customize component variants
<Button className="custom-primary-button" variant="primary">
  Custom Styled Button
</Button>
```

### CSS Custom Properties

```css
/* Override design system variables */
:root {
  --ui-primary: #your-color;
  --ui-radius: 8px;
}
```

## Troubleshooting

1. **Styling Issues**: Ensure Tailwind CSS is properly configured
2. **Component Errors**: Check component prop types and requirements
3. **Build Issues**: Verify the package is built before consuming apps
4. **Theme Problems**: Check CSS custom properties and Tailwind config

## Best Practices

1. **Don't import navigation components** - Each app should have unique navbars
2. **Extend, don't override** - Use className to add app-specific styles
3. **Maintain consistency** - Use the design system for spacing and colors
4. **Test accessibility** - Ensure components work with screen readers
5. **Responsive design** - Components are mobile-first by default
