# Ghana Build UI - Style Reset Documentation

## Overview

The Ghana Build UI style reset (`src/styles/style-reset.css`) provides a comprehensive foundation for consistent cross-browser styling. This reset is designed with modern web standards and accessibility best practices in mind.

## Features

### Core Reset Functionality

- **Box Model Normalization**: All elements use `box-sizing: border-box` for predictable sizing
- **Margin/Padding Reset**: Removes default browser margins and padding
- **Typography Consistency**: Establishes consistent font rendering across browsers
- **Responsive Foundation**: Prevents horizontal scroll and sets up proper viewport handling

### Accessibility Enhancements

- **Screen Reader Support**: Includes `.sr-only` utility class for screen reader-only content
- **Keyboard Navigation**: Proper focus styles for keyboard users
- **Reduced Motion**: Respects user preference for reduced motion
- **Color Scheme Support**: Automatic dark mode support via `prefers-color-scheme`
- **High Contrast**: Enhanced contrast support for accessibility needs

### Cross-Browser Compatibility

- **Font Smoothing**: Optimized text rendering on WebKit and Mozilla browsers
- **Consistent Baseline**: Normalizes default styles across different browsers
- **Mobile-First**: Designed with mobile devices as the primary target

## Usage

### Integration

The style reset is automatically imported via `src/styles/tailwind-base.css`:

```css
@layer base {
  @import './style-reset.css';
  /* Additional base styles... */
}
```

### Customization

While the reset provides a solid foundation, you can customize it by:

1. **CSS Custom Properties**: Modify the CSS variables defined in `tailwind-base.css`
2. **Layer Override**: Add custom styles in the Tailwind `@layer base` section
3. **Component Styles**: Build upon the reset with component-specific styles

### Utility Classes

The reset includes several utility classes:

- `.sr-only` - Screen reader only content
- `:focus-visible` - Enhanced focus styles for keyboard navigation

## Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 88+
- **Accessibility**: WCAG 2.1 AA compliant focus indicators

## Color Scheme Support

The reset automatically adapts to user preferences:

```css
/* Light mode (default) */
body {
  color: #333333;
  background-color: #ffffff;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  body {
    color: #e5e5e5;
    background-color: #1a1a1a;
  }
}
```

## Performance Considerations

- **Minimal CSS**: Only includes essential reset rules
- **No JavaScript Dependencies**: Pure CSS solution
- **Optimized for Compression**: Well-structured for gzip compression
- **Critical Path**: Should be loaded early in the document head

## Testing

The style reset is covered by visual regression tests that verify:

- Cross-browser consistency
- Dark/light mode switching
- Responsive behavior
- Accessibility compliance

Run visual regression tests:

```bash
npm run test:visual
```

## Contributing

When modifying the style reset:

1. Ensure changes maintain cross-browser compatibility
2. Test with accessibility tools (screen readers, keyboard navigation)
3. Verify visual regression tests pass
4. Update this documentation if adding new features

## Related Files

- `src/styles/tailwind-base.css` - Extended Tailwind base layer
- `playwright.config.ts` - Visual regression test configuration
- `e2e/reset-style-visual.test.ts` - Visual regression tests
- `stylelint.config.js` - CSS linting rules

## Changelog

### v1.0.0
- Initial implementation with comprehensive reset rules
- Accessibility enhancements and focus management
- Dark mode and high contrast support
- Cross-browser compatibility optimizations