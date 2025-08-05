# Ghana Build UI v1

A modern React application with comprehensive CSS architecture, automated quality checks, and visual regression testing.

## Features

- **Modern CSS Architecture**: Custom style reset and Tailwind CSS integration
- **Pre-commit Quality Checks**: Automated linting and formatting with Husky
- **Visual Regression Testing**: Playwright + Percy integration for cross-browser testing
- **CI/CD Pipeline**: Automated testing and deployment workflows
- **Accessibility First**: WCAG 2.1 AA compliant styling and components

## Development Setup

### Prerequisites

- Node.js 20.x
- npm 10.x+

### Installation

```bash
# Clone the repository
git clone https://github.com/Engineer233/ghanabuild-ui-v1.git
cd ghanabuild-ui-v1

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint:css` - Lint CSS files with stylelint
- `npm run lint:css:fix` - Auto-fix CSS linting issues
- `npm run test:visual` - Run visual regression tests
- `npm run test:visual:update` - Update visual baseline images
- `npm run test:visual:ui` - Run tests with Playwright UI

## Code Quality

### Pre-commit Hooks

The project uses Husky for Git hooks and lint-staged for efficient linting:

- **CSS Linting**: Stylelint automatically checks all staged CSS files
- **Auto-fixing**: Common style issues are automatically fixed
- **Commit Blocking**: Commits are blocked if linting fails

### CSS Architecture

```
src/
├── styles/
│   ├── style-reset.css      # Global style reset
│   └── tailwind-base.css    # Tailwind base configuration
├── components/              # Component-specific styles
└── index.css               # Main entry point
```

### Stylelint Configuration

The project uses stylelint with rules focused on:
- CSS syntax validation
- Property validation
- Tailwind CSS compatibility
- Cross-browser consistency

## Visual Regression Testing

### Playwright + Percy Setup

Visual tests cover:
- **Cross-browser**: Chrome, Firefox, Safari
- **Responsive**: Desktop (1280px), Tablet (768px), Mobile (375px)
- **Color schemes**: Light and dark mode
- **Accessibility**: Focus states and reduced motion

### Running Visual Tests

```bash
# Run all visual tests
npm run test:visual

# Run tests with Percy integration (requires PERCY_TOKEN)
PERCY_TOKEN=your_token npm run test:visual

# Update baseline images
npm run test:visual:update
```

## CI/CD Pipeline

### Automated Checks

On every push and pull request:
1. **CSS Linting** - Validates all CSS files
2. **Build Verification** - Ensures project builds successfully
3. **Visual Testing** - Compares screenshots across browsers
4. **Deployment** - Deploys to Vercel on main branch

### Required Environment Variables

```bash
# Percy Visual Testing
PERCY_TOKEN=your_percy_token

# Vercel Deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## Documentation

- [Style Reset Documentation](docs/STYLE-RESET.md)
- [CSS Deployment Guide](docs/DEPLOYMENT-CSS-README.md)

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

### Development Guidelines

- Follow the existing CSS architecture
- Ensure all tests pass before submitting PR
- Update documentation for new features
- Maintain accessibility standards

## License

This project is private and proprietary.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.