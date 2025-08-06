import * as Sentry from '@sentry/react'
import LogRocket from 'logrocket'

// Initialize Sentry for error tracking
export function initSentry() {
  const dsn = process.env.REACT_APP_SENTRY_DSN

  if (dsn && process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration()
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      beforeSend(event) {
        // Filter out development errors
        if (event.exception) {
          const error = event.exception.values?.[0]
          if (error?.value?.includes('ResizeObserver') || 
              error?.value?.includes('Non-Error promise rejection')) {
            return null
          }
        }
        return event
      }
    })

    // Set user context
    Sentry.setContext('app', {
      name: 'ghanabuild-ui-v1',
      version: process.env.REACT_APP_VERSION || '1.0.0'
    })
  }
}

// Initialize LogRocket for session recording and performance monitoring
export function initLogRocket() {
  const appId = process.env.REACT_APP_LOGROCKET_APP_ID

  if (appId && process.env.NODE_ENV === 'production') {
    LogRocket.init(appId, {
      // Network capture
      network: {
        requestSanitizer: request => {
          // Sanitize sensitive data from requests
          if (request.headers.authorization) {
            request.headers.authorization = '[REDACTED]'
          }
          return request
        },
        responseSanitizer: response => {
          // Sanitize sensitive data from responses
          return response
        }
      },
      // DOM capture
      dom: {
        textSanitizer: true,
        inputSanitizer: true
      },
      // Console capture
      console: true
    })

    // Connect LogRocket to Sentry
    if (process.env.REACT_APP_SENTRY_DSN) {
      LogRocket.getSessionURL((sessionURL) => {
        Sentry.setContext('LogRocket', {
          sessionURL
        })
      })
    }
  }
}

// Identify user for LogRocket
export function identifyUser(userInfo) {
  if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_LOGROCKET_APP_ID) {
    LogRocket.identify(userInfo.id || 'anonymous', {
      name: userInfo.name || 'Anonymous User',
      email: userInfo.email || '',
      // Add any additional user properties
    })
  }

  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.setUser({
      id: userInfo.id || 'anonymous',
      email: userInfo.email || '',
      username: userInfo.name || 'Anonymous User'
    })
  }
}

// Track custom events
export function trackEvent(eventName, properties = {}) {
  // LogRocket custom events
  if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_LOGROCKET_APP_ID) {
    LogRocket.track(eventName, properties)
  }

  // Sentry custom events
  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message: eventName,
      level: 'info',
      data: properties
    })
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('Event:', eventName, properties)
  }
}

// Log errors manually
export function logError(error, context = {}) {
  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.withScope((scope) => {
      scope.setContext('error_context', context)
      Sentry.captureException(error)
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error, context)
  }
}

// Performance tracking
export function trackPerformance(name, duration, metadata = {}) {
  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message: `Performance: ${name}`,
      level: 'info',
      data: {
        duration,
        ...metadata
      }
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(`Performance: ${name}`, { duration, ...metadata })
  }
}

export default {
  initSentry,
  initLogRocket,
  identifyUser,
  trackEvent,
  logError,
  trackPerformance
}