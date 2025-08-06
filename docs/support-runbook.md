# Support Runbook - Ghanabuild.AI

## Table of Contents
1. [System Overview](#system-overview)
2. [Common Issues & Solutions](#common-issues--solutions)
3. [Monitoring & Health Checks](#monitoring--health-checks)
4. [Emergency Procedures](#emergency-procedures)
5. [Deployment Procedures](#deployment-procedures)
6. [Performance Troubleshooting](#performance-troubleshooting)
7. [Contact Information](#contact-information)

## System Overview

### Architecture
- **Frontend**: React 18 + Vite (Port 5173 dev, served via CDN in production)
- **Backend**: Express.js API (Port 3001)
- **Database**: File-based storage (upgrade to PostgreSQL/MongoDB for production)
- **Hosting**: Vercel (frontend) + Railway/Heroku (backend)

### Key Components
- **Main Application**: React SPA with form-based cost estimation
- **API Server**: Express.js with OpenAPI documentation
- **Monitoring**: Sentry (errors) + Datadog (performance) + Google Analytics
- **Security**: GDPR compliance, Helmet.js security headers

## Common Issues & Solutions

### 1. Application Won't Start

**Symptoms**: Server fails to start, build errors
**Causes**: Missing dependencies, environment variables, port conflicts

**Solutions**:
```bash
# Check Node.js version
node --version  # Should be 20.x+

# Install dependencies
npm ci

# Check environment variables
cat .env

# Check port availability
lsof -i :3001  # Backend
lsof -i :5173  # Frontend dev server

# Restart with clean cache
rm -rf node_modules package-lock.json
npm install
```

### 2. API Endpoints Not Responding

**Symptoms**: 500 errors, timeouts, CORS errors
**Check**: Health endpoint first
```bash
curl -v http://localhost:3001/api/health
```

**Solutions**:
- **CORS Issues**: Update `FRONTEND_URL` in environment
- **500 Errors**: Check server logs for stack traces
- **Timeouts**: Check database/external service connections

### 3. Build Failures

**Common Build Errors**:
```bash
# Tailwind CSS issues
npm install -D @tailwindcss/postcss

# TypeScript/ESLint errors
npm run lint:fix

# Memory issues during build
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### 4. GDPR Banner Issues

**Symptoms**: Banner not showing, consent not saving
**Debug**:
```javascript
// Clear consent in browser console
localStorage.removeItem('gdpr-consent')
location.reload()

// Check consent data
JSON.parse(localStorage.getItem('gdpr-consent'))
```

### 5. Cost Estimation Errors

**Symptoms**: Form validation fails, API returns errors
**Common Fixes**:
- Check input validation rules in `src/App.jsx`
- Verify regional cost multipliers in `server.js`
- Test with minimal valid data:
  ```json
  {
    "region": "Greater Accra",
    "projectType": "residential",
    "totalFloorArea": 1000,
    "numberOfBathrooms": 2,
    "numberOfFloors": 1
  }
  ```

## Monitoring & Health Checks

### Health Endpoints
```bash
# Backend health
curl http://localhost:3001/api/health

# Expected response
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "1.0.0"
}
```

### Performance Monitoring
- **Response Times**: Should be < 2s for estimate calculations
- **Memory Usage**: Monitor Node.js heap usage
- **Error Rates**: < 1% for API endpoints

### Log Locations
- **Frontend Errors**: Browser console + Sentry
- **Backend Logs**: Application logs + Morgan HTTP logs
- **API Requests**: Structured JSON logs

### Key Metrics to Monitor
1. **Availability**: Uptime > 99.9%
2. **Performance**: P95 response time < 3s
3. **Error Rate**: < 1% of requests
4. **Form Completions**: Track conversion rates

## Emergency Procedures

### 1. Complete Service Outage

**Immediate Actions** (within 5 minutes):
1. Check health endpoints
2. Review error logs for patterns
3. Verify external dependencies
4. Check hosting provider status

**Escalation Steps**:
1. Restart application services
2. Roll back to last known good deployment
3. Scale up resources if needed
4. Contact hosting provider if infrastructure issue

### 2. High Error Rates

**Investigation**:
```bash
# Check recent errors
grep "ERROR" /var/log/app.log | tail -50

# Monitor real-time errors
tail -f /var/log/app.log | grep ERROR

# Check API response times
curl -w "%{time_total}" http://localhost:3001/api/estimate
```

### 3. Performance Degradation

**Quick Fixes**:
1. Check system resources (CPU, memory, disk)
2. Restart application services
3. Clear caches if applicable
4. Scale horizontally if auto-scaling available

### 4. Security Incident

**Immediate Response**:
1. **DO NOT** restart services (preserve evidence)
2. Document timeline and symptoms
3. Check access logs for suspicious activity
4. Contact security team immediately

**Log Analysis**:
```bash
# Check failed login attempts (when auth implemented)
grep "401\|403" /var/log/access.log

# Look for suspicious request patterns
grep -E "(SELECT|UNION|<script)" /var/log/access.log
```

## Deployment Procedures

### Pre-Deployment Checklist
- [ ] All tests passing (unit + e2e)
- [ ] Code review completed
- [ ] Environment variables updated
- [ ] Database migrations tested
- [ ] Rollback plan prepared

### Deployment Steps
```bash
# 1. Build frontend
npm run build

# 2. Test production build locally
npm run preview

# 3. Deploy backend
# (Follow hosting provider instructions)

# 4. Deploy frontend
# (Vercel: auto-deploy on git push)

# 5. Verify deployment
curl -f https://api.ghanabuildai.com/api/health
```

### Post-Deployment Verification
1. Check all critical user flows
2. Verify API endpoints respond correctly
3. Test form submission and cost calculation
4. Confirm monitoring systems are receiving data
5. Check error rates in first 30 minutes

### Rollback Procedure
```bash
# Vercel rollback
vercel --prod rollback

# Manual rollback
git revert <commit-hash>
git push origin main
```

## Performance Troubleshooting

### Frontend Performance Issues

**Slow Page Load**:
- Check bundle size: `npm run build` (should be < 500KB gzipped)
- Optimize images and assets
- Enable CDN for static assets
- Check Lighthouse score (target > 90)

**Runtime Performance**:
- Use React DevTools Profiler
- Check for unnecessary re-renders
- Optimize form validation logic
- Monitor memory leaks in long sessions

### Backend Performance Issues

**Slow API Responses**:
```bash
# Profile API calls
time curl -X POST http://localhost:3001/api/estimate -d @test-data.json

# Check Node.js performance
node --prof server.js
```

**Memory Leaks**:
```bash
# Monitor memory usage
node --expose-gc --inspect server.js

# Force garbage collection
kill -USR2 <node-pid>
```

### Database Performance (Future)
When migrating from file storage:
- Monitor query execution times
- Optimize indexes
- Use connection pooling
- Implement query caching

## Contact Information

### Emergency Contacts
- **Primary On-Call**: +233-XXX-XXXX (24/7)
- **Secondary On-Call**: +233-XXX-XXXX
- **Development Team Lead**: dev-lead@ghanabuildai.com

### Escalation Matrix
1. **Level 1**: Support Team (Response: 15 min)
2. **Level 2**: Development Team (Response: 1 hour)
3. **Level 3**: Architecture Team (Response: 4 hours)
4. **Level 4**: External Consultants (Response: 24 hours)

### Vendor Contacts
- **Hosting Provider**: Vercel/Railway support
- **DNS Provider**: Cloudflare support
- **SSL Provider**: Let's Encrypt (automated)
- **Monitoring**: Sentry, Datadog support

### Communication Channels
- **Incidents**: #incidents-ghanabuild (Slack)
- **General Support**: #support-ghanabuild (Slack)
- **Development**: #dev-ghanabuild (Slack)
- **Email**: support@ghanabuildai.com

## Troubleshooting Commands Reference

```bash
# System health
curl http://localhost:3001/api/health
npm run lint
npm run build
npm run test:e2e

# Process management
pm2 status              # If using PM2
pm2 restart all
pm2 logs --lines 100

# Log analysis
tail -f /var/log/app.log
grep -i error /var/log/app.log | tail -20
journalctl -u ghanabuild-api -f

# Performance testing
ab -n 100 -c 10 http://localhost:3001/api/health
wrk -t12 -c400 -d30s http://localhost:3001/api/health

# Security checks
npm audit
npm audit fix
nmap -sV localhost
```

## Recovery Time Objectives (RTO)

- **Critical Issues**: 15 minutes
- **Major Issues**: 1 hour
- **Minor Issues**: 4 hours
- **Planned Maintenance**: 30 minutes

## Recovery Point Objectives (RPO)

- **User Data**: 1 hour (implement regular backups)
- **Configuration**: Real-time (version controlled)
- **Application State**: 15 minutes

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-01  
**Next Review**: 2025-02-01