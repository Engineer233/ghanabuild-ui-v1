# Ghana Build UI - CSS Deployment Guide

## Overview

This guide covers the deployment pipeline and CSS-related build processes for the Ghana Build UI project. It includes information about our CSS architecture, build tools, quality checks, and deployment procedures.

## CSS Architecture

### File Structure

```
src/
├── styles/
│   ├── style-reset.css      # Global style reset
│   └── tailwind-base.css    # Tailwind base configuration
├── components/              # Component-specific styles
└── index.css               # Main entry point
```

### Build Pipeline

The CSS build process uses the following tools:

1. **PostCSS**: Processes and transforms CSS
2. **Tailwind CSS**: Utility-first CSS framework
3. **Autoprefixer**: Adds vendor prefixes automatically
4. **Vite**: Build tool and development server

## Quality Assurance

### Pre-commit Hooks

All CSS files are automatically checked before commit using:

- **Husky**: Git hook management
- **lint-staged**: Run linters on staged files
- **Stylelint**: CSS linting and formatting

### CSS Linting

Stylelint configuration (`stylelint.config.js`) enforces:

- Code consistency and formatting
- Best practices and conventions
- Accessibility requirements
- Performance optimizations

Run linting manually:

```bash
# Lint all CSS files
npm run lint:css

# Fix auto-fixable issues
npm run lint:css:fix

# Check specific files
npx stylelint "src/**/*.css"
```

### Visual Regression Testing

Playwright with Percy integration provides:

- **Cross-browser testing**: Chrome, Firefox, Safari
- **Responsive testing**: Desktop, tablet, mobile viewports
- **Theme testing**: Light and dark mode variations
- **Component isolation**: Individual component visual tests

Run visual tests:

```bash
# Run all visual regression tests
npm run test:visual

# Run tests for specific component
npm run test:visual -- --grep "style-reset"

# Update visual baselines (requires approval)
npm run test:visual:update
```

## Development Workflow

### Local Development

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Watch for CSS changes**:
   CSS files are automatically recompiled and hot-reloaded during development.

3. **Test CSS changes**:
   ```bash
   # Run linting
   npm run lint:css
   
   # Run visual tests
   npm run test:visual
   ```

### Code Review Process

1. **Automated Checks**: Pre-commit hooks ensure code quality
2. **CI Pipeline**: GitHub Actions run full test suite
3. **Visual Review**: Percy provides visual diff reviews
4. **Manual Review**: Team reviews CSS architecture and implementation

## Deployment Pipeline

### Continuous Integration

GitHub Actions workflow (`.github/workflows/`):

```yaml
# CSS-specific CI steps
- name: Install dependencies
  run: npm ci

- name: Lint CSS
  run: npm run lint:css

- name: Build CSS
  run: npm run build

- name: Visual regression tests
  run: npm run test:visual
  env:
    PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

### Production Build

The production build process:

1. **CSS Processing**:
   - PostCSS transforms and optimizes CSS
   - Tailwind purges unused styles
   - Autoprefixer adds browser compatibility

2. **Optimization**:
   - CSS minification and compression
   - Critical CSS extraction
   - Asset fingerprinting for cache busting

3. **Output**:
   ```
   dist/
   ├── assets/
   │   ├── index-[hash].css  # Main CSS bundle
   │   └── index-[hash].js   # JavaScript bundle
   └── index.html            # HTML with asset references
   ```

### Deployment Environments

#### Staging
- **URL**: `https://staging.ghanabuild.com`
- **Auto-deploy**: On push to `develop` branch
- **Visual tests**: Full suite with Percy integration

#### Production
- **URL**: `https://ghanabuild.com`
- **Manual deploy**: Triggered after staging approval
- **Visual tests**: Critical path verification

## Performance Monitoring

### CSS Metrics

Monitor the following CSS performance indicators:

- **Bundle size**: Target <50KB gzipped
- **Load time**: Critical CSS <1s
- **Unused CSS**: <10% unused styles in production
- **Lighthouse scores**: Performance >90

### Optimization Strategies

1. **CSS Purging**: Tailwind automatically removes unused styles
2. **Critical CSS**: Above-the-fold styles inlined
3. **Code Splitting**: Component-specific CSS bundles
4. **Caching**: Long-term caching with content hashing

## Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check PostCSS configuration
   npm run build -- --debug
   
   # Verify Tailwind config
   npx tailwindcss --content "./src/**/*.{js,jsx}" --output debug.css
   ```

2. **Linting Errors**:
   ```bash
   # Auto-fix common issues
   npm run lint:css:fix
   
   # Check specific rules
   npx stylelint "src/**/*.css" --formatter verbose
   ```

3. **Visual Test Failures**:
   ```bash
   # Compare visual differences
   npm run test:visual -- --ui
   
   # Update baselines if changes are intentional
   npm run test:visual:update
   ```

### Performance Issues

1. **Large CSS bundles**:
   - Review Tailwind purge configuration
   - Analyze unused CSS with coverage tools
   - Consider component-level CSS splitting

2. **Slow build times**:
   - Check PostCSS plugin performance
   - Optimize Tailwind JIT compilation
   - Review file watching patterns

## Environment Variables

Required environment variables for deployment:

```bash
# Percy visual testing
PERCY_TOKEN=your_percy_token

# Build optimization
NODE_ENV=production
VITE_BUILD_MODE=production

# CSS configuration
CSS_PURGE_ENABLED=true
CSS_MINIFY_ENABLED=true
```

## Monitoring and Alerts

### GitHub Actions Notifications

- **Failed builds**: Team notification via Slack
- **Visual changes**: Percy review assignments
- **Performance regressions**: Bundle size alerts

### Production Monitoring

- **Core Web Vitals**: Monitor CSS impact on performance
- **Error tracking**: CSS parsing and loading errors
- **User experience**: Visual consistency across browsers

## Contributing

### CSS Guidelines

1. **Follow BEM methodology** for custom component styles
2. **Use Tailwind utilities** whenever possible
3. **Maintain accessibility** standards (WCAG 2.1 AA)
4. **Test across browsers** and devices
5. **Document breaking changes** in pull requests

### Review Checklist

- [ ] CSS passes stylelint checks
- [ ] Visual regression tests pass
- [ ] Responsive design works on all breakpoints
- [ ] Dark mode compatibility maintained
- [ ] Accessibility requirements met
- [ ] Performance impact assessed
- [ ] Documentation updated if needed

## Support

For CSS-related issues or questions:

- **GitHub Issues**: Technical problems and bug reports
- **Team Chat**: Quick questions and discussions
- **Documentation**: Refer to component-specific docs
- **Visual Reviews**: Use Percy for design approval

## Related Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PostCSS Plugin Documentation](https://postcss.org/)
- [Stylelint Rules](https://stylelint.io/user-guide/rules/)
- [Playwright Visual Testing](https://playwright.dev/docs/test-ui-mode)
- [Percy Visual Testing](https://docs.percy.io/)