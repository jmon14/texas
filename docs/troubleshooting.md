# Troubleshooting Guide

This document covers common issues you might encounter when developing or deploying the Texas Poker application, along with their solutions.

## 🐳 Docker & Development Environment Issues

### Docker Compose Won't Start

**Problem**: `docker-compose up` fails or services don't start properly.

**Common Causes & Solutions**:

1. **Port conflicts**
   ```bash
   # Check what's using the ports
   lsof -i :3000 -i :8080 -i :5432 -i :27017

   # Kill processes on specific ports
   sudo kill -9 $(lsof -ti:3000)
   ```

2. **Docker daemon not running**
   ```bash
   # Start Docker (macOS)
   open -a Docker
   
   # Linux
   sudo systemctl start docker
   ```

3. **Insufficient disk space**
   ```bash
   # Clean up Docker resources
   docker system prune -af --volumes
   ```

### Service Can't Connect to Database

**Problem**: Application services can't connect to PostgreSQL or MongoDB.

**Solutions**:

1. **Check container networking**
   ```bash
   # Inspect Docker network
   docker network ls
   docker network inspect texas-network

   # Check if containers are in the same network
   docker ps --format "table {{.Names}}\t{{.Networks}}"
   ```

2. **Verify database containers are running**
   ```bash
   # Check container status
   docker-compose ps

   # Check database logs
   docker-compose logs postgres
   docker-compose logs mongodb
   ```

3. **Connection string issues**
   - Development PostgreSQL: Use container name (`postgres:5432`)
   - Development MongoDB: Use container name (`mongodb:27017`)
   - Production: Use actual hostnames/IPs from environment variables (Supabase for PostgreSQL, MongoDB Atlas for ranges)

### Hot Reload Not Working

**Problem**: Changes to code don't trigger automatic reloads.

**Solutions**:

1. **Volume mounting issues**
   ```bash
   # Check if volumes are mounted correctly
   docker-compose ps -v
   
   # Restart with fresh volumes
   docker-compose down -v
   docker-compose up
   ```

2. **Node.js specific issues**
   ```bash
   # Clear node_modules and reinstall
   docker-compose exec frontend rm -rf node_modules
   docker-compose exec frontend npm install
   ```

## 🔐 Authentication Issues

### JWT Token Problems

**Problem**: Users get logged out frequently or can't authenticate.

**Solutions**:

1. **Token expiration issues**
   - Check token expiry times in environment variables
   - Verify refresh token mechanism is working
   - Check browser developer tools for token refresh calls

2. **Cookie issues**
   ```javascript
   // Check cookies in browser console
   document.cookie
   
   // Clear all cookies for domain
   // Go to Application > Cookies in DevTools and clear
   ```

3. **CORS issues**
   - Verify CORS configuration allows credentials
   - Check that frontend and backend domains match CORS settings

### Email Verification Not Working

**Problem**: Users don't receive verification emails.

**Solutions**:

1. **Development (Ethereal Email)**
   ```bash
   # Check Backend logs for email URLs
   docker-compose logs backend | grep -i ethereal
   ```

2. **Production (AWS SES)**
   - Verify AWS SES configuration in SSM parameters
   - Check SES sending limits and domain verification
   - Review Backend logs for AWS errors

## 🌐 API Issues

### API Endpoints Not Responding

**Problem**: HTTP requests to API endpoints return 404 or connection errors.

**Solutions**:

1. **Check service health**
   ```bash
   # Test API endpoints directly
   curl http://localhost:3000/health
   curl http://localhost:3000/api
   ```

2. **Verify Nginx routing** (Production)
   ```bash
   # Check Nginx configuration
   sudo nginx -t
   sudo systemctl reload nginx
   
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Check container status**
   ```bash
   # Verify all services are running
   docker-compose ps

   # Check specific service logs
   docker-compose logs backend
   docker-compose logs frontend
   ```

### Database Connection Errors

**Problem**: API services can't connect to databases.

**Solutions**:

1. **Connection string validation**
   - Development PostgreSQL: `postgresql://admin:admin@postgres:5432/backend`
   - Development MongoDB: `mongodb://mongodb:27017/texas`
   - Production: Use connection strings from environment variables (check MONGODB_URI in Backend .env)

2. **Database authentication**
   ```bash
   # Test PostgreSQL connection
   docker-compose exec postgres psql -U admin -d backend

   # Test MongoDB connection
   docker-compose exec mongodb mongosh texas
   ```

3. **Network connectivity**
   ```bash
   # Test connectivity between containers
   docker-compose exec backend ping postgres
   docker-compose exec backend ping mongodb
   ```

## 🚀 Deployment Issues

### AWS Deployment Failures

**Problem**: `./infrastructure/deploy.sh` fails or times out.

**Solutions**:

1. **AWS credentials and permissions**
   ```bash
   # Verify AWS CLI configuration
   aws sts get-caller-identity
   
   # Check required permissions for SSM, S3, ECR
   aws ssm describe-parameters --max-results 10
   ```

2. **EC2 instance not found**
   - Verify EC2 instance is running
   - Check that instance has tag `Name=texas-server`
   - Ensure SSM agent is running on the instance

3. **ECR authentication issues**
   ```bash
   # Manually test ECR login
   aws ecr get-login-password --region eu-central-1 | \
   docker login --username AWS --password-stdin <ecr-registry-url>
   ```

### SSL Certificate Issues

**Problem**: HTTPS not working or certificate errors.

**Solutions**:

1. **Let's Encrypt rate limits**
   - Check if you've exceeded rate limits (5 certs per week per domain)
   - Use staging environment for testing: `--staging` flag with certbot

2. **DNS propagation**
   ```bash
   # Check DNS resolution
   nslookup allinrange.com
   nslookup www.allinrange.com
   
   # Verify A records point to correct IP
   dig A allinrange.com +short
   ```

3. **Certificate renewal**
   ```bash
   # Manually renew certificates (on EC2)
   sudo certbot renew --dry-run
   ```

### Container Issues in Production

**Problem**: Containers won't start or crash in production.

**Solutions**:

1. **Check container logs**
   ```bash
   # SSH to EC2 instance via SSM
   aws ssm start-session --target <instance-id>
   
   # Check Docker logs
   docker logs <container-name>
   docker-compose -f infrastructure/docker-compose.prod.yml logs
   ```

2. **Resource constraints**
   ```bash
   # Check system resources
   free -h
   df -h
   docker stats
   
   # Check for out-of-memory kills
   dmesg | grep -i "killed process"
   ```

3. **Environment variable issues**
   ```bash
   # Verify environment variables are set
   docker-compose -f infrastructure/docker-compose.prod.yml config
   
   # Check SSM parameters
   aws ssm get-parameters-by-path --path "/texas" --recursive
   ```

## 🔧 Database Issues

### PostgreSQL Connection Problems

**Problem**: Cannot connect to PostgreSQL database.

**Solutions**:

1. **Connection limits**
   ```sql
   -- Check current connections
   SELECT count(*) FROM pg_stat_activity;
   
   -- Check connection limit
   SHOW max_connections;
   ```

2. **Password authentication**
   - Verify credentials in environment variables
   - Check if database user exists and has proper permissions

### MongoDB Issues

**Problem**: Backend API can't connect to MongoDB.

**Solutions**:

1. **Local MongoDB (Development)**
   ```bash
   # Check MongoDB container logs
   docker-compose logs mongodb

   # Test connection
   docker-compose exec mongodb mongosh texas

   # Verify Backend can reach MongoDB
   docker-compose exec backend ping mongodb
   ```

2. **MongoDB Atlas (Production)**
   - Verify IP whitelist includes your deployment server
   - Check connection string format in Backend's .env file
   - Test connection from command line:
   ```bash
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/texas"
   ```

3. **Environment variables**
   ```bash
   # Verify MongoDB URI is set in Backend
   docker-compose exec backend env | grep MONGODB_URI

   # Check Backend logs for connection errors
   docker-compose logs backend | grep -i mongo
   ```

## 🎨 Frontend Issues

### Build Failures

**Problem**: `npm run build` fails for Frontend.

**Solutions**:

1. **TypeScript errors**
   ```bash
   # Run type checking
   cd apps/frontend
   npx tsc --noEmit

   # Check for ESLint errors
   npm run lint
   ```

2. **Dependency issues**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### API Client Generation Issues

**Problem**: OpenAPI client generation fails.

**Solutions**:

1. **API service not running**
   ```bash
   # Ensure Backend is running before generating clients
   curl http://localhost:3000/api-json
   ```

2. **OpenAPI spec issues**
   - Verify API endpoint returns valid OpenAPI JSON
   - Check for breaking changes in API structure
   - Regenerate after backend API updates: `npm run openapi:backend`

## 📱 Browser Issues

### CORS Errors

**Problem**: Browser blocks API requests due to CORS policy.

**Solutions**:

1. **Development environment**
   - Verify all services use correct CORS origins
   - Check that frontend and backend ports match configuration

2. **Production environment**
   - Ensure Nginx proxy passes CORS headers correctly
   - Verify domain names match exactly (including www subdomain)

### Session Storage Issues

**Problem**: User sessions don't persist or theme settings are lost.

**Solutions**:

1. **Local storage**
   ```javascript
   // Clear browser storage (in DevTools console)
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Cookie issues**
   - Check cookie security settings (Secure, SameSite)
   - Verify domain and path attributes

## 🔍 Debugging Tips

### Logging and Monitoring

1. **Application logs**
   ```bash
   # Development
   docker-compose logs -f <service-name>
   
   # Production
   docker logs -f <container-id>
   ```

2. **Network debugging**
   ```bash
   # Check network connectivity
   docker-compose exec <service> ping <target>
   
   # Monitor network traffic
   docker-compose exec <service> netstat -tuln
   ```

3. **Database debugging**
   ```bash
   # PostgreSQL queries
   docker-compose exec postgres psql -U admin -d backend -c "SELECT * FROM users LIMIT 5;"

   # MongoDB queries (Development)
   docker-compose exec mongodb mongosh texas --eval "db.ranges.find().limit(5)"

   # MongoDB queries (Production - via MongoDB Atlas shell or Compass)
   mongosh "mongodb+srv://..." --eval "db.ranges.find().limit(5)"
   ```

## 🆘 Getting Help

### Information to Include in Bug Reports

1. **Environment details**
   - Development vs Production
   - Operating system
   - Docker version
   - Browser version (for frontend issues)

2. **Error reproduction steps**
   - Exact commands run
   - Expected vs actual behavior
   - Screenshots or error messages

3. **System state**
   - Container status (`docker-compose ps`)
   - Recent logs (last 50 lines)
   - Environment variables (redacted secrets)

### Useful Commands for Debugging

```bash
# System overview
docker-compose ps
docker stats --no-stream
free -h && df -h

# Service health
curl -i http://localhost:3000/health
curl -i http://localhost:8080

# Database connectivity
docker-compose exec backend npm run migrate
docker-compose exec backend ping postgres

# Log analysis
docker-compose logs --tail=50 <service>
grep -i error <logfile>
```

Remember: When in doubt, try the "turn it off and on again" approach:
```bash
docker-compose down
docker-compose up -d
```