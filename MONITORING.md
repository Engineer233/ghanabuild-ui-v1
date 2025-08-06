# Monitoring and Analytics Setup Guide

This document describes how to set up and configure monitoring and analytics for the Ghanabuild UI application.

## Overview

The application uses two primary monitoring services:

1. **Sentry** - Error tracking and performance monitoring
2. **LogRocket** - Session recording and user behavior tracking

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Sentry Configuration
REACT_APP_SENTRY_DSN=your_sentry_dsn_here

# LogRocket Configuration  
REACT_APP_LOGROCKET_APP_ID=your_logrocket_app_id_here
```

### Sentry Setup

1. **Create a Sentry Account**
   - Go to [sentry.io](https://sentry.io) and create an account
   - Create a new project for "React"
   - Copy the DSN from your project settings

2. **Configure Sentry DSN**
   ```bash
   REACT_APP_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

3. **Features Enabled**
   - Error tracking and crash reporting
   - Performance monitoring
   - Session replay (10% of sessions, 100% of error sessions)
   - Custom breadcrumbs for user actions
   - Context data for debugging

### LogRocket Setup

1. **Create a LogRocket Account**
   - Go to [logrocket.com](https://logrocket.com) and create an account
   - Create a new app in your dashboard
   - Copy the App ID from your app settings

2. **Configure LogRocket App ID**
   ```bash
   REACT_APP_LOGROCKET_APP_ID=your-app-id/project-name
   ```

3. **Features Enabled**
   - Full session recordings
   - Network request/response logging
   - Console log capture
   - DOM interaction tracking
   - Performance metrics
   - Integration with Sentry for correlated debugging

## Monitoring Features

### Error Tracking

The application automatically tracks:
- JavaScript errors and exceptions
- API request failures
- Validation errors
- Component crashes (via Error Boundary)

### Performance Monitoring

The application tracks:
- API request response times
- Form validation performance
- Page load metrics
- Core Web Vitals

### User Analytics

The application tracks:
- Form submission attempts
- Validation failures
- Estimate requests
- Retry actions
- Error boundary triggers

### Custom Events

You can track custom events using the monitoring utilities:

```javascript
import { trackEvent, logError, trackPerformance } from './monitoring.js'

// Track user actions
trackEvent('button_clicked', { buttonName: 'submit' })

// Log errors with context
logError(new Error('Custom error'), { userId: '123', action: 'form_submit' })

// Track performance metrics
trackPerformance('api_call', 250, { endpoint: '/estimate' })
```

## Data Privacy and Security

### Sensitive Data Handling

The monitoring setup includes automatic sanitization:

- **LogRocket**: 
  - Authorization headers are redacted
  - Text and input sanitization enabled
  - Custom sanitizers for request/response data

- **Sentry**:
  - Development errors filtered out
  - User context limited to non-sensitive data
  - Before-send hooks for data scrubbing

### Production Only

Monitoring is only active in production environment (`NODE_ENV === 'production'`). In development:
- Events are logged to console instead
- No data is sent to external services
- Error boundary shows detailed stack traces

## Monitoring Dashboard URLs

Once configured, you can access your monitoring dashboards:

- **Sentry Dashboard**: https://sentry.io/organizations/your-org/projects/
- **LogRocket Dashboard**: https://app.logrocket.com/your-app-id/

## Troubleshooting

### Common Issues

1. **Monitoring not working**
   - Check that environment variables are set correctly
   - Verify you're running in production mode
   - Check browser console for initialization errors

2. **Missing events**
   - Ensure `trackEvent()` calls are in the right places
   - Check network tab for blocked requests
   - Verify environment variables in deployment

3. **Too much data**
   - Adjust sample rates in `monitoring.js`
   - Update before-send filters for Sentry
   - Configure LogRocket capture settings

### Debug Mode

In development, monitoring calls are logged to console:

```javascript
// This will log to console in development
trackEvent('test_event', { data: 'value' })
```

## Cost Optimization

### Sentry

- Uses 100% trace sample rate for performance monitoring
- Uses 10% session replay sample rate
- Filters out common browser/dev errors

### LogRocket

- Network capture enabled with sanitization
- DOM and console capture optimized
- Session recording limited to user interactions

### Recommendations

- Monitor quota usage in both services
- Adjust sample rates based on traffic
- Set up alerts for quota limits
- Review and update filters regularly

## Integration with CI/CD

The monitoring setup works automatically with:
- Vercel deployments (environment variables)
- GitHub Actions (no additional setup needed)
- Docker deployments (pass environment variables)

## Support

For monitoring-related issues:
1. Check the service status pages
2. Review the application logs
3. Contact the respective support teams:
   - Sentry: https://sentry.io/support/
   - LogRocket: https://docs.logrocket.com/