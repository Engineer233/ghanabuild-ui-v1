# Ghanabuild.AI - Production Website

A fully interactive, secure, high-performance production website for Ghana construction cost estimation.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm (comes with Node.js)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/Engineer233/ghanabuild-ui-v1.git
   cd ghanabuild-ui-v1
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development servers:**
   ```bash
   # Terminal 1 - Frontend (React + Vite)
   npm run dev

   # Terminal 2 - Backend API (Express.js)
   npm run server
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api/docs

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client for API calls

### Backend Stack
- **Express.js** - Web framework for Node.js
- **Swagger/OpenAPI** - API documentation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging

### Testing & Quality
- **Playwright** - End-to-end testing
- **ESLint** - Code linting and formatting
- **GitHub Actions** - CI/CD pipeline

### Monitoring & Analytics (Stubs)
- **Sentry** - Error monitoring
- **Datadog** - Application performance monitoring
- **Google Analytics** - User analytics

## 🔧 Available Scripts

### Development
- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run server:dev` - Start backend with file watching

### Building & Production
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build locally

### Testing
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run Playwright tests with UI

### Code Quality
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## 🌐 API Endpoints

### Health Check
- **GET** `/api/health` - Service health status

### Projects
- **GET** `/api/projects` - List all projects
- **POST** `/api/projects` - Create new project

### Cost Estimation
- **POST** `/api/estimate` - Calculate construction cost estimate

### Documentation
- **GET** `/api/docs` - Interactive Swagger UI documentation

## 🔒 Security Features

### Implemented
- **HTTPS ready** - Production configuration supports HTTPS
- **Security headers** - Helmet.js for secure HTTP headers
- **CORS protection** - Configurable cross-origin policies
- **Input validation** - Form and API input validation
- **GDPR compliance** - Cookie consent banner
- **Environment variables** - Sensitive data protection

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## 📊 Monitoring & Analytics

### Error Monitoring (Sentry)
```javascript
import { monitoring } from './src/monitoring.js';

// Capture errors
monitoring.captureError(error, context);

// Track performance
monitoring.trackPerformance('api_response_time', duration);
```

### Performance Monitoring (Datadog)
- Custom metrics and performance tracking
- User interaction monitoring
- API response time tracking

### User Analytics (Google Analytics)
- Page view tracking
- Event tracking
- Conversion tracking
- User behavior analysis

## 🧪 Testing Strategy

### End-to-End Tests (Playwright)
Located in `tests/e2e/`:
- **Smoke tests** - Core functionality verification
- **Form validation** - Input validation testing
- **API integration** - Backend connectivity tests
- **Responsive design** - Mobile/desktop compatibility
- **Accessibility** - WCAG compliance checks

### Running Tests
```bash
# Install browsers (first time)
npx playwright install

# Run all tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run specific test
npx playwright test smoke.spec.js
```

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] HTTPS certificates installed
- [ ] Security headers configured
- [ ] Monitoring services activated
- [ ] Database connections tested
- [ ] Performance optimization enabled
- [ ] Error logging configured
- [ ] Backup procedures in place

### Environment Variables
```bash
# Frontend
VITE_API_BASE_URL=https://api.ghanabuildai.com

# Backend
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://www.ghanabuildai.com

# Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Monitoring
SENTRY_DSN=your_sentry_dsn
DATADOG_API_KEY=your_datadog_key
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX-X
```

### Build Commands
```bash
# Build frontend
npm run build

# Start production server
npm run server
```

## 📁 Project Structure

```
ghanabuild-ui-v1/
├── src/
│   ├── components/          # React components
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point
│   ├── monitoring.js       # Analytics & monitoring
│   └── index.css           # Global styles
├── tests/
│   └── e2e/                # Playwright tests
├── docs/                   # Documentation
├── .github/
│   └── workflows/          # CI/CD pipelines
├── server.js               # Express.js backend
├── playwright.config.js    # Test configuration
├── vite.config.js          # Build configuration
├── tailwind.config.js      # Styling configuration
└── package.json            # Dependencies & scripts
```

## 🔧 Configuration Files

### Vite Configuration (`vite.config.js`)
- React plugin setup
- Development server configuration
- Build optimization

### Tailwind Configuration (`tailwind.config.js`)
- Content paths for purging
- Custom theme extensions
- Plugin configurations

### PostCSS Configuration (`postcss.config.js`)
- Tailwind CSS processing
- Autoprefixer for browser compatibility

### ESLint Configuration (`eslint.config.js`)
- React-specific rules
- Code quality standards
- Browser/Node.js globals

## 🐛 Troubleshooting

### Common Issues

**Build fails with Tailwind errors:**
```bash
npm install -D @tailwindcss/postcss
```

**Playwright browser installation fails:**
```bash
npx playwright install --with-deps
```

**API connection errors:**
- Check if backend server is running on correct port
- Verify CORS settings in server.js
- Check environment variables

**GDPR banner not showing:**
- Clear localStorage: `localStorage.removeItem('gdpr-consent')`
- Check browser console for errors

### Performance Issues
- Use browser dev tools for performance profiling
- Check network tab for slow API calls
- Monitor bundle size with `npm run build`

## 📋 Support & Maintenance

### Logging
- Frontend errors: Browser console + Sentry
- Backend errors: Server logs + structured logging
- API requests: Morgan HTTP logging

### Health Monitoring
- **Health endpoint:** `/api/health`
- **Uptime monitoring:** Configure external service
- **Performance metrics:** Datadog dashboards

### Regular Maintenance
- Security updates: Monthly dependency updates
- Performance review: Weekly monitoring reports
- Backup verification: Daily automated checks
- Documentation updates: With each feature release

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `npm run test:e2e`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For technical support or questions:
- Email: support@ghanabuildai.com
- Documentation: `/docs`
- API Documentation: `/api/docs`