# Texas Poker Analysis Platform

This repository contains a full-stack poker analysis platform with multiple services:

- **Quickview**: Frontend application (React/TypeScript)
- **Ultron**: Main backend service (NestJS)
- **Vision**: Poker range analysis service (Java Spring Boot)
- **Texas-sim**: Poker game simulator (Go)

## Prerequisites

- Docker
- Docker Compose
- AWS CLI (for production deployment)
- Terraform (for infrastructure management)

## Development Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd texas
```

2. Build and start all services:

```bash
docker-compose up --build
```

This will start all services and make them available at:

- Quickview frontend: http://localhost:8080
- Ultron API: http://localhost:3000
- Vision API: http://localhost:3001

## Production Deployment

### Infrastructure Setup

1. **Configure AWS credentials** in your `.env` file:

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=eu-central-1
```

2. **Deploy AWS infrastructure**:

```bash
cd infrastructure/aws
terraform init
terraform plan
terraform apply
```

3. **Upload environment variables** to AWS SSM:

```bash
cd infrastructure
./upload-env-to-ssm.sh
```

### SSL Certificates

The application uses HTTPS with SSL certificates:

- **Development**: Self-signed certificates (automatically generated)
- **Production**: Let's Encrypt certificates (recommended)

To generate self-signed certificates for testing:

```bash
cd infrastructure/nginx
./generate-ssl.sh
```

### Deploy Application

Deploy to production:

```bash
./infrastructure/deploy.sh
```

Your application will be available at:

- **HTTPS**: https://allinrange.com (redirects from HTTP)
- **Backend APIs**: Only accessible internally (not exposed to external users)

## Security Features

- **HTTPS only**: All HTTP traffic redirects to HTTPS
- **Backend isolation**: API endpoints only accessible from frontend
- **SSL/TLS**: Modern cipher suites and security headers
- **HSTS**: Strict Transport Security headers
- **XSS Protection**: Content Security Policy headers

## Services Overview

### Quickview (Frontend)

- Port: 8080 (internal), 80/443 (external via Nginx)
- React/TypeScript application
- Connects to Ultron and Vision services
- Only service accessible to external users

### Ultron (Backend)

- Port: 3000 (internal only)
- NestJS application
- Handles user authentication and core services
- Uses PostgreSQL database
- Not directly accessible from internet

### Vision (Range Analysis)

- Port: 3001 (internal only)
- Java Spring Boot application
- Manages poker ranges
- Uses MongoDB database
- Not directly accessible from internet

### Texas-sim (Game Simulator)

- Go application
- Simulates Texas Hold'em poker games

### Nginx (Reverse Proxy)

- Ports: 80 (HTTP redirect), 443 (HTTPS)
- Handles SSL termination
- Routes traffic to appropriate services
- Provides security and caching

## Stopping the Services

### Development

```bash
docker-compose down
```

To stop and remove volumes:

```bash
docker-compose down -v
```

### Production

```bash
cd infrastructure/aws
terraform destroy
```

## SSL Certificate Management

### For Production (Let's Encrypt)

1. **Install Certbot** on your EC2 instance:

```bash
sudo yum install -y certbot python3-certbot-nginx
```

2. **Obtain certificates**:

```bash
sudo certbot --nginx -d allinrange.com -d www.allinrange.com
```

3. **Auto-renewal** (certbot sets this up automatically):

```bash
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Certificate Files Location

- **Development**: `infrastructure/nginx/ssl/`
- **Production**: `/etc/letsencrypt/live/allinrange.com/`
